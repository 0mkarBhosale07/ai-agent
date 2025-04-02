import axios from "axios";
import { getWeather } from "./weather";
import Todo, { ITodo } from "@/models/Todo";
import generateQR from "@omkarbhosale/upiqr";
// import generateImage from "@omkarbhosale/upiimage";
import { HfInference } from "@huggingface/inference";
import { GoogleGenAI } from "@google/genai";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface Tool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

interface AIResponse {
  tool: string;
  params: Record<string, any>;
  explanation: string;
  agentMessage: string;
}

const tools: Tool[] = [
  {
    name: "get_weather",
    description:
      "Get current weather for one or more cities. Use 'cities' parameter as string for single city or array of strings for multiple cities.",
    execute: async (params: { cities: string | string[] }) => {
      return await getWeather(params.cities);
    },
  },
  {
    name: "add_todo",
    description: "Add a new todo task",
    execute: async (params: { title: string }) => {
      const todo = await Todo.create({ title: params.title });
      return todo;
    },
  },
  {
    name: "get_todos",
    description: "Get all todo tasks, optionally filtered by title",
    execute: async (params?: { search?: string }) => {
      const query = params?.search
        ? { title: { $regex: params.search, $options: "i" } }
        : {};
      return await Todo.find(query).sort({ createdAt: -1 });
    },
  },
  {
    name: "delete_todo",
    description: "Delete a todo task by title or ID",
    execute: async (params: { title?: string; id?: string }) => {
      if (params.id) {
        return await Todo.findByIdAndDelete(params.id);
      } else if (params.title) {
        return await Todo.findOneAndDelete({
          title: { $regex: params.title, $options: "i" },
        });
      }
      throw new Error("Either title or id must be provided");
    },
  },
  {
    name: "generate_upi_qr",
    description: "Generate a UPI QR code for payment",
    execute: async (params: { upi_id: string; amount: number }) => {
      const qrCode = await generateQR({
        UPI_ID: params.upi_id,
        AMOUNT: params.amount,
      });
      return { qrCode };
    },
  },
  {
    name: "generate_image",
    description: "Generate an image based on a text description",
    execute: async (params: { prompt: string }) => {
      try {
        if (!GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is not configured");
        }

        console.log(
          "Initializing Gemini AI with API key:",
          GEMINI_API_KEY.substring(0, 10) + "..."
        );
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        console.log("Sending request to Gemini with prompt:", params.prompt);
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp-image-generation",
          contents: params.prompt,
          config: {
            responseModalities: ["Text", "Image"],
          },
        });

        console.log(
          "Received response from Gemini:",
          JSON.stringify(response, null, 2)
        );

        if (!response.candidates?.[0]?.content?.parts) {
          console.error("Invalid response structure:", response);
          throw new Error("Invalid response from Gemini API");
        }

        // Find the image part in the response
        const imagePart = response.candidates[0].content.parts.find(
          (part) => part.inlineData
        );

        if (!imagePart?.inlineData) {
          console.error(
            "No image part found in response:",
            response.candidates[0].content.parts
          );
          throw new Error("No image was generated");
        }

        const imageData = imagePart.inlineData.data;
        console.log("Successfully extracted image data");
        return { image: `data:image/png;base64,${imageData}` };
      } catch (error) {
        console.error("Error in generate_image tool:", error);
        if (error instanceof Error) {
          throw new Error(`Image generation failed: ${error.message}`);
        }
        throw error;
      }
    },
  },
];

export async function processUserPrompt(prompt: string) {
  const startTime = process.hrtime();
  const systemPrompt = `You are an AI assistant with access to the following tools:
${tools.map((tool) => `- ${tool.name}: ${tool.description}`).join("\n")}

When a user asks a question, analyze their request and determine which tool(s) to use.
Respond with a JSON object containing:
1. "tool": The name of the tool to use
2. "params": The parameters needed for the tool
3. "explanation": A brief explanation of why you chose this tool
4. "agentMessage": A user-friendly message summarizing what action was taken

Important: 
- For weather requests, you can get weather for multiple cities at once. Use the 'cities' parameter as an array when multiple cities are requested.
- For the add_todo tool, use "title" as the parameter name, not "task".
- For the get_todos tool, use "search" parameter to filter tasks by title.
- For the delete_todo tool, you can delete by either "title" or "id". When deleting by title, use the "title" parameter.
- When a user indicates they have completed a task (e.g., "I am done with X", "I finished X", "X is complete"), use the delete_todo tool to remove that task.
- For generate_upi_qr tool, use "upi_id" and "amount" parameters to generate a QR code.
- For generate_image tool, use "prompt" parameter with a detailed description of the image to generate.

Example responses:
{
  "tool": "get_weather",
  "params": { "cities": "London" },
  "explanation": "The user asked about weather in London",
  "agentMessage": "Here's the current weather in London"
}
{
  "tool": "get_weather",
  "params": { "cities": ["Mumbai", "Delhi", "Bangalore"] },
  "explanation": "The user asked about weather in multiple cities",
  "agentMessage": "Here's the current weather for Mumbai, Delhi, and Bangalore"
}
{
  "tool": "add_todo",
  "params": { "title": "Buy groceries" },
  "explanation": "The user requested to add a new todo task",
  "agentMessage": "Added new task: Buy groceries"
}
{
  "tool": "get_todos",
  "params": { "search": "home" },
  "explanation": "The user asked about tasks related to home, so searching for tasks containing 'home' in their title",
  "agentMessage": "Here are your tasks related to home"
}
{
  "tool": "get_todos",
  "params": {},
  "explanation": "The user requested to get all todo tasks",
  "agentMessage": "Here are your tasks"
}
{
  "tool": "delete_todo",
  "params": { "title": "Clean desk" },
  "explanation": "The user indicated they completed cleaning their desk, so removing that task",
  "agentMessage": "Task 'Clean desk' has been deleted"
}
{
  "tool": "generate_upi_qr",
  "params": { "upi_id": "omkar@ybl", "amount": 200 },
  "explanation": "The user requested to generate a UPI QR code for payment",
  "agentMessage": "Here's your UPI QR code for ₹200"
}
{
  "tool": "generate_image",
  "params": { "prompt": "A beautiful sunset over mountains" },
  "explanation": "The user requested to generate an image of a sunset",
  "agentMessage": "I'll generate an image of a beautiful sunset over mountains"
}`;

  try {
    console.log("Sending request to Ollama:", {
      model: "mistral",
      prompt: `${systemPrompt}\n\nUser: ${prompt}`,
    });

    const loadStartTime = process.hrtime();
    const response = await axios.post<{ response: string }>(OLLAMA_API_URL, {
      model: "mistral",
      prompt: `${systemPrompt}\n\nUser: ${prompt}`,
      stream: false,
    });
    const loadEndTime = process.hrtime(loadStartTime);
    const loadDuration = loadEndTime[0] * 1e9 + loadEndTime[1]; // Convert to nanoseconds

    console.log("Ollama response:", response.data);

    const aiResponse = JSON.parse(response.data.response) as AIResponse;
    const selectedTool = tools.find((tool) => tool.name === aiResponse.tool);

    if (!selectedTool) {
      throw new Error(`Invalid tool selected: ${aiResponse.tool}`);
    }

    const result = await selectedTool.execute(aiResponse.params);

    // Format agentMessage based on the tool and result
    let formattedMessage:
      | string
      | {
          type: string;
          loading: boolean;
          data: Record<string, any>;
        } = aiResponse.agentMessage;

    if (aiResponse.tool === "get_todos") {
      const todos = result as ITodo[];
      if (todos.length === 0) {
        formattedMessage = "You have no tasks at the moment";
      } else {
        const taskList = todos
          .map((todo, index) => `[${index + 1}] ${todo.title}`)
          .join(", ");
        formattedMessage = `You have ${todos.length} task(s) for now: ${taskList}`;
      }
    } else if (aiResponse.tool === "delete_todo") {
      const deletedTodo = result as ITodo;
      if (deletedTodo) {
        formattedMessage = `Task '${deletedTodo.title}' has been deleted`;
      } else {
        formattedMessage = "No matching task found to delete";
      }
    } else if (aiResponse.tool === "get_weather") {
      const weatherResults = result as Array<{
        temperature: number;
        humidity: number;
        description: string;
        city: string;
      }>;
      formattedMessage = weatherResults
        .map(
          (weather) =>
            `${weather.city}: ${
              weather.description
            } with temperature of ${Math.round(weather.temperature)}°C and ${
              weather.humidity
            }% humidity`
        )
        .join("\n");
    } else if (aiResponse.tool === "generate_upi_qr") {
      const { qrCode } = result as { qrCode: string };
      formattedMessage = {
        type: "qr-code",
        loading: true,
        data: {
          qrCode,
          amount: aiResponse.params.amount,
        },
      };
    } else if (aiResponse.tool === "generate_image") {
      const { image } = result as { image: string };
      formattedMessage = {
        type: "generated-image",
        loading: true,
        data: {
          image,
          prompt: aiResponse.params.prompt,
        },
      };
    }

    const endTime = process.hrtime(startTime);
    const totalDuration = endTime[0] * 1e9 + endTime[1]; // Convert to nanoseconds

    return {
      tool: aiResponse.tool,
      explanation: aiResponse.explanation,
      agentMessage: formattedMessage,
      result,
      total_duration: totalDuration,
      load_duration: loadDuration,
    };
  } catch (error) {
    console.error("Detailed error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
    throw error;
  }
}

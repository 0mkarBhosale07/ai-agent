import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { processUserPrompt } from "@/lib/ai-agent";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { prompt, useDeepSearch } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    if (useDeepSearch) {
      await connectDB(); // Only connect to MongoDB if DeepSearch is enabled
      const result = await processUserPrompt(prompt);
      return NextResponse.json(result);
    } else {
      // Simple chat mode - use Ollama API directly
      try {
        const response = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "mistral",
            prompt: prompt,
            stream: false,
          }
        );

        return NextResponse.json({
          agentMessage: response.data.response,
          explanation: "Simple chat response using Mistral model",
        });
      } catch (error) {
        console.error("Error calling Ollama API:", error);
        return NextResponse.json({
          agentMessage:
            "I apologize, but I'm having trouble connecting to the AI model. Please try again later.",
          explanation: "Error connecting to Ollama API",
        });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

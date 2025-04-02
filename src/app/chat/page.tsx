"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import JsonViewer from "./JsonViewer";
import { Toggle } from "@/components/ui/toggle";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { UserCircle2, Bot, Loader2 } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { ThinkingAnimation } from "./ThinkingAnimation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Custom components for MDX
const components = {
  pre: ({ children, ...props }: any) => (
    <div className="relative">
      <pre {...props} className="overflow-x-auto p-4 bg-gray-900 rounded-lg">
        {children}
      </pre>
    </div>
  ),
  code: ({ children, ...props }: any) => (
    <code {...props} className="bg-gray-800 rounded px-1 py-0.5">
      {children}
    </code>
  ),
};

interface Message {
  role: "user" | "assistant";
  content: string | StructuredMessage;
  timestamp: Date;
  thinking?: boolean;
  searchResults?: {
    explanation: string;
    result: any;
    timestamp: Date;
    metrics?: {
      totalDuration: number;
      loadDuration: number;
    };
  };
}

// Add type definitions for structured messages
interface QRCodeData {
  qrCode: string;
  amount: number;
}

interface GeneratedImageData {
  image: string;
  prompt: string;
}

interface StructuredMessage {
  type: "qr-code" | "generated-image";
  loading: boolean;
  data: QRCodeData | GeneratedImageData;
}

interface MessageContentProps {
  content: string | StructuredMessage;
  isAssistant?: boolean;
}

const BouncingDots = () => (
  <div className="flex space-x-2">
    <motion.div
      className="w-2 h-2 bg-current rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
    <motion.div
      className="w-2 h-2 bg-current rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, delay: 0.1, repeat: Infinity }}
    />
    <motion.div
      className="w-2 h-2 bg-current rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
    />
  </div>
);

const MessageAvatar = ({
  role,
  userImage,
}: {
  role: "user" | "assistant";
  userImage?: string | null;
}) => (
  <div className="overflow-hidden flex-shrink-0 w-8 h-8 rounded-full">
    {role === "user" && userImage ? (
      <Image
        src={userImage}
        alt="User"
        width={32}
        height={32}
        className="object-cover"
      />
    ) : (
      <div
        className={`w-full h-full flex items-center justify-center ${
          role === "user" ? "bg-blue-600" : "bg-purple-600"
        }`}
      >
        {role === "user" ? (
          <UserCircle2 className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
    )}
  </div>
);

// Update QR Code component with proper typing
const QRCodeDisplay = ({ data }: { data: QRCodeData }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-full max-w-[400px]">
        <div className="relative aspect-square">
          <div className="absolute inset-0 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="flex absolute inset-0 justify-center items-center">
            <div className="w-8 h-8 rounded-full border-4 border-white animate-spin border-t-transparent"></div>
          </div>
          <img
            src={data.qrCode}
            alt="UPI QR Code"
            className="w-full h-full rounded-lg opacity-0 transition-opacity duration-500"
            onLoad={(e) => {
              e.currentTarget.classList.remove("opacity-0");
              e.currentTarget.classList.add("opacity-100");
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const pulse = parent.querySelector(".animate-pulse");
                const spin = parent.querySelector(".animate-spin");
                if (pulse) pulse.remove();
                if (spin) spin.remove();
              }
            }}
          />
        </div>
        <a
          href={data.qrCode}
          download="upi-qr-code.png"
          className="inline-flex items-center px-3 py-1 mt-2 text-sm text-white bg-gray-800 rounded-md transition-colors hover:bg-gray-700"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download QR Code
        </a>
      </div>
    </div>
  );
};

// Update Generated Image component with proper typing
const GeneratedImage = ({ data }: { data: GeneratedImageData }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-full max-w-[400px]">
        <div className="relative aspect-square">
          <div className="absolute inset-0 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="flex absolute inset-0 justify-center items-center">
            <div className="w-8 h-8 rounded-full border-4 border-white animate-spin border-t-transparent"></div>
          </div>
          <img
            src={data.image}
            alt={data.prompt}
            className="w-full h-full rounded-lg opacity-0 transition-opacity duration-500"
            onLoad={(e) => {
              e.currentTarget.classList.remove("opacity-0");
              e.currentTarget.classList.add("opacity-100");
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const pulse = parent.querySelector(".animate-pulse");
                const spin = parent.querySelector(".animate-spin");
                if (pulse) pulse.remove();
                if (spin) spin.remove();
              }
            }}
          />
        </div>
        <a
          href={data.image}
          download="generated-image.png"
          className="inline-flex items-center px-3 py-1 mt-2 text-sm text-white bg-gray-800 rounded-md transition-colors hover:bg-gray-700"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Image
        </a>
      </div>
    </div>
  );
};

function MessageContent({ content, isAssistant = false }: MessageContentProps) {
  const [isTyping, setIsTyping] = useState(true);

  // Handle structured content with type checking
  if (typeof content !== "string") {
    if (content.type === "qr-code") {
      return <QRCodeDisplay data={content.data as QRCodeData} />;
    }
    if (content.type === "generated-image") {
      return <GeneratedImage data={content.data as GeneratedImageData} />;
    }
    return null;
  }

  // From this point on, content is guaranteed to be a string
  useEffect(() => {
    if (!isAssistant) {
      setIsTyping(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, content.length * 20);

    return () => clearTimeout(timer);
  }, [content, isAssistant]);

  useEffect(() => {
    // Apply syntax highlighting after content is fully typed
    if (!isTyping) {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [isTyping]);

  if (isAssistant && isTyping) {
    return (
      <TypeAnimation
        sequence={[content, () => setIsTyping(false)]}
        speed={90}
        wrapper="div"
        repeat={0}
        cursor={false}
        className="whitespace-pre-wrap"
      />
    );
  }

  // Only process string content
  let formattedContent = content;
  try {
    formattedContent = content.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match: string, lang: string, code: string) => {
        const language = lang || "plaintext";
        try {
          const highlighted = hljs.highlight(code.trim(), { language }).value;
          return `<pre><code class="language-${language}">${highlighted}</code></pre>`;
        } catch (e) {
          return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
        }
      }
    );
  } catch (error) {
    console.error("Error formatting content:", error);
    // Use the original content if formatting fails
    formattedContent = content;
  }

  return (
    <div
      className="max-w-none prose prose-invert"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(formattedContent),
      }}
    />
  );
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepSearchEnabled, setIsDeepSearchEnabled] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll main chat to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Scroll DeepSearch to bottom if enabled
    if (isDeepSearchEnabled && searchResultsRef.current) {
      const container = searchResultsRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Also scroll when loading state changes

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message with animation
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    // Check if the message is requesting an image
    if (
      userMessage.toLowerCase().includes("generate image") ||
      userMessage.toLowerCase().includes("create image")
    ) {
      setIsGeneratingImage(true);
      setImagePrompt(userMessage);

      // Add thinking state with skeleton animation
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `
            <div class="flex flex-col items-center space-y-4">
              <div class="w-full max-w-[400px]">
                <div class="relative aspect-square">
                  <div class="absolute inset-0 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
                <div class="mt-2 space-y-2">
                  <div class="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div class="w-3/4 h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div class="w-1/2 h-4 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>`,
          timestamp: new Date(),
          thinking: true,
        },
      ]);

      try {
        console.log("Sending image generation request...");
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: userMessage }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate image");
        }

        const data = await response.json();
        console.log("Image generation response received");

        if (!data.success || !data.image) {
          throw new Error("Invalid response from image generation API");
        }

        // Remove thinking message and add the generated image
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.thinking);
          return [
            ...filtered,
            {
              role: "assistant",
              content: `
                <div class="flex flex-col items-center space-y-2">
                  <div class="w-full max-w-[400px]">
                    <div class="relative aspect-square">
                      <div class="absolute inset-0 bg-gray-800 rounded-lg animate-pulse"></div>
                      <img 
                        src="${data.image}" 
                        alt="Generated Image" 
                        class="w-full h-full rounded-lg opacity-0 blur-xl transition-all ease-out duration-800"
                        onload="this.classList.remove('opacity-0', 'blur-xl'); this.classList.add('opacity-100', 'blur-0')"
                        onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyMDIwMjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5JbWFnZSBnZW5lcmF0aW9uIGZhaWxlZDwvdGV4dD48L3N2Zz4='"
                      />
                    </div>
                    <a 
                      href="${data.image}" 
                      download="generated-image.png" 
                      class="inline-flex items-center px-3 py-1 mt-2 text-sm text-white bg-gray-800 rounded-md transition-colors hover:bg-gray-700"
                    >
                      <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Download Image
                    </a>
                  </div>
                </div>`,
              timestamp: new Date(),
            },
          ];
        });
      } catch (error) {
        console.error("Error generating image:", error);
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.thinking);
          return [
            ...filtered,
            {
              role: "assistant",
              content: `Sorry, I encountered an error generating the image: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              timestamp: new Date(),
            },
          ];
        });
      } finally {
        setIsGeneratingImage(false);
        setImagePrompt("");
      }
      return;
    }

    // Add thinking state
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        thinking: true,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          useDeepSearch: isDeepSearchEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const data = await response.json();
      console.log("Full response data:", data);

      let parsedResponse;
      try {
        parsedResponse =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;
        console.log("Parsed response:", parsedResponse);
      } catch (e) {
        console.error("Error parsing response:", e);
        parsedResponse = data;
      }

      // Remove thinking message and add actual response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.thinking);
        return [
          ...filtered,
          {
            role: "assistant",
            content: parsedResponse?.agentMessage || data.agentMessage,
            timestamp: new Date(),
            searchResults: isDeepSearchEnabled
              ? {
                  explanation: parsedResponse?.explanation || data.explanation,
                  result: data,
                  timestamp: new Date(),
                  metrics: {
                    totalDuration: data.total_duration || 0,
                    loadDuration: data.load_duration || 0,
                  },
                }
              : undefined,
          },
        ];
      });

      console.log("Metrics being set:", {
        totalDuration: data.total_duration,
        loadDuration: data.load_duration,
      });
    } catch (error) {
      console.error("Error processing prompt:", error);
      const errorMessage =
        "Sorry, I encountered an error processing your request.";
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.thinking);
        return [
          ...filtered,
          {
            role: "assistant",
            content: errorMessage,
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen text-white bg-black">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">ReAct Agent</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-56">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user?.name}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </header>

        {/* Messages */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <MessageAvatar
                    role={message.role}
                    userImage={
                      message.role === "user" ? session?.user?.image : null
                    }
                  />
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {message.thinking ? (
                      <BouncingDots />
                    ) : (
                      <MessageContent
                        content={message.content}
                        isAssistant={message.role === "assistant"}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form - Now with sticky positioning */}
        <motion.div
          className="flex-shrink-0 p-4 bg-black border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Toggle
                pressed={isDeepSearchEnabled}
                onPressedChange={setIsDeepSearchEnabled}
                size="lg"
                variant={isDeepSearchEnabled ? "default" : "outline"}
                aria-label="Toggle DeepSearch"
              >
                <span className="text-sm font-medium">
                  Advance Mode {isDeepSearchEnabled ? "ON" : "OFF"}
                </span>
              </Toggle>
            </div>
            <div className="text-xs text-gray-500">
              {isDeepSearchEnabled ? "Using Tools" : "LLM Chat Mode"}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <motion.input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isDeepSearchEnabled
                  ? "Ask about weather, todos, or generate an image..."
                  : "Chat with AI or generate an image..."
              }
              className="flex-1 px-3 py-2 text-sm text-white bg-gray-900 rounded-md border border-gray-700 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              disabled={isLoading || isGeneratingImage}
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || isGeneratingImage}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading || isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Search Results Sidebar - Only show when DeepSearch is enabled */}
      <AnimatePresence>
        {isDeepSearchEnabled && (
          <motion.div
            className="w-[400px] border-l border-gray-800 bg-black flex flex-col h-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-shrink-0 p-4 border-b border-gray-800">
              <motion.h2
                className="text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                DeepSearch
              </motion.h2>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div ref={searchResultsRef} className="space-y-4 text-sm">
                <AnimatePresence>
                  {messages.map(
                    (message, index) =>
                      message.searchResults && (
                        <motion.div
                          key={index}
                          className="p-4 space-y-3 bg-gray-900 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-xs text-gray-500">
                            {message.searchResults.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="text-gray-300 whitespace-pre-wrap">
                            {message.searchResults.explanation}
                          </div>
                          <motion.div
                            className="overflow-x-auto p-2 mt-2 font-mono text-xs bg-gray-800 rounded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <JsonViewer data={message.searchResults.result} />
                          </motion.div>
                          {message.searchResults.metrics && (
                            <div className="pt-2 mt-2 border-t border-gray-800">
                              <div className="space-y-1 text-xs text-gray-400">
                                <div>
                                  Total Duration:{" "}
                                  {(
                                    message.searchResults.metrics
                                      .totalDuration / 1_000_000_000
                                  ).toFixed(3)}
                                  s
                                </div>
                                <div>
                                  Load Duration:{" "}
                                  {(
                                    message.searchResults.metrics.loadDuration /
                                    1_000_000_000
                                  ).toFixed(3)}
                                  s
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                  )}
                  {isLoading && (
                    <motion.div
                      className="p-4 bg-gray-900 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ThinkingAnimation />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

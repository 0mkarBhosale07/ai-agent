import React from "react";

interface ChatMessageProps {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">
            {role === "user" ? "You" : "Assistant"}
          </span>
          <span className="text-xs opacity-70">{timestamp}</span>
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}

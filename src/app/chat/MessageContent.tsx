import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface MessageContentProps {
  content: string;
  isAssistant: boolean;
}

export function MessageContent({ content, isAssistant }: MessageContentProps) {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    const formatContent = (text: string) => {
      // Format code blocks
      let formatted = text.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, lang, code) => {
          const language = lang || "plaintext";
          const highlighted = hljs.highlight(code.trim(), { language }).value;
          return `<pre class="overflow-x-auto p-4 bg-gray-800 rounded-lg"><code class="language-${language}">${highlighted}</code></pre>`;
        }
      );

      // Format inline code
      formatted = formatted.replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-800 px-1 py-0.5 rounded">$1</code>'
      );

      // Convert newlines to <br> tags (outside of pre tags)
      formatted = formatted.replace(/\n/g, "<br />");

      return formatted;
    };

    // Format content immediately for user messages
    if (!isAssistant) {
      setFormattedContent(formatContent(content));
      setIsTypingComplete(true);
    } else {
      setFormattedContent(formatContent(content));
      // Set typing complete after a delay for assistant messages
      const timer = setTimeout(() => {
        setIsTypingComplete(true);
      }, content.length * 90); // Roughly match the typing speed
      return () => clearTimeout(timer);
    }
  }, [content, isAssistant]);

  if (!isAssistant) {
    return (
      <div
        className="max-w-none whitespace-pre-wrap prose prose-invert"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  }

  return (
    <div className="max-w-none prose prose-invert">
      {!isTypingComplete ? (
        <TypeAnimation
          sequence={[content]}
          wrapper="div"
          speed={90}
          repeat={0}
          cursor={false}
        />
      ) : (
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Problem } from "../../../../types/game/game";
import { useProblem } from "../hooks/useProblem";
import CodeEditor from "./CodeEditor";
import { motion } from "framer-motion";
import IconButton from "../../../../components/ui/IconButton";
import useScreen from "../../../../hooks/useScreen";
import { formatAIResponse } from "../../../../utils/helper";

interface ProblemChatProps {
  problem: Problem;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ProblemChat: React.FC<ProblemChatProps> = ({
  problem,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { getProblemChatAnswer } = useProblem();
  const [messages, setMessages] = useState<
    Array<{
      sender: string;
      text: string;
      code?: { language: string; content: string };
    }>
  >([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreen();
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Detect keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const visualViewportHeight =
          window.visualViewport?.height || window.innerHeight;
        setIsKeyboardVisible(visualViewportHeight < window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (!isCollapsed && input !== undefined) {
      const inputElement = document.getElementById("problem-chat-input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isCollapsed, input]);

  const parseCodeBlocks = (text: string) => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const matches = [];
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      matches.push({
        language: match[1] || "plaintext",
        content: match[2].trim(),
      });
    }
    return matches;
  };

  const removeCodeBlocks = (text: string) =>
    text.replace(/```(\w+)?\s*([\s\S]*?)```/g, "").trim();

  // Format the conversation history and user input for the AI
  const formatInput = (userInput: string) => {
    let prompt = "";

    if (conversationHistory.length > 0) {
      prompt += ` //Conversation History: ${conversationHistory.join(" ")}`;
    }

    prompt += ` //user input starts now// ${userInput} /////`;

    return prompt;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      // Format the input for the AI
      const formattedInput = formatInput(input);

      // Get the AI's response
      const answer = await getProblemChatAnswer(problem, formattedInput);

      // Format the AI response
      const formattedAnswer = formatAIResponse(answer);

      const codeBlocks = parseCodeBlocks(formattedAnswer);
      const messageText = removeCodeBlocks(formattedAnswer);

      if (codeBlocks.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: messageText,
            code: codeBlocks[0],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: formattedAnswer,
          },
        ]);
      }

      // Update conversation history
      setConversationHistory((prev) => [
        ...prev,
        `//User: ${input}// //You: ${formattedAnswer}//`,
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Failed to fetch answer. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-12" : "min-w-[300px] max-w-[400px] w-[30vw]"
      }`}
      role="region"
      aria-label="Problem Chat"
    >
      {!isMobile && (
        <div className="absolute right-2 top-3 z-10 flex flex-col gap-2">
          {/* Toggle Collapse Button */}
          <IconButton
            onClick={onToggleCollapse}
            ariaLabel={isCollapsed ? "Expand chat" : "Collapse chat"}
            ariaPressed={false}
            icon={isCollapsed ? ChevronLeft : ChevronRight}
          />
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`flex flex-col h-full min-h-[540px] transition-all bg-gray-100 dark:bg-dark-background rounded-lg ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        {/* Header */}
        {!isMobile && (
          <div className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground p-4 border-b border-light-border dark:border-dark-border">
            <MessageCircle size={16} className="mb-1" />
            <span>Chat about Problem</span>
          </div>
        )}

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide space-y-4 p-4"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Ask questions about the problem to get started
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-light-primary dark:bg-dark-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                } break-words whitespace-pre-wrap overflow-hidden`}
              >
                {message.text && (
                  <p className="whitespace-pre-wrap overflow-hidden">
                    {message.text}
                  </p>
                )}
                {message.code && (
                  <div className="mt-2 h-[400px] w-full md:min-w-[400px] min-w-[100px]">
                    <CodeEditor
                      gameMode="solo"
                      starterCode={message.code.content}
                      isReadOnly={true}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <motion.div
                className="w-4 h-4 bg-light-primary dark:bg-dark-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div
          className={`flex items-center gap-2 p-4 border-t border-light-border dark:border-dark-border ${
            isKeyboardVisible
              ? "fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
        >
          <input
            id="problem-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the problem..."
            className="flex-1 p-2 px-3 rounded-lg border border-transparent focus:border-light-primary focus:dark:border-dark-primary bg-white dark:bg-gray-900 text-black dark:text-white outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary/80 dark:hover:bg-dark-primary/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemChat;

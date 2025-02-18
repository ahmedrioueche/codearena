import React, { useState, useRef, useEffect } from "react";
import { GameMode } from "../../../../types/game/game";
import Editor, { Monaco } from "@monaco-editor/react";

interface CodeEditorProps {
  gameMode: GameMode;
  width: number;
  onResize: (newWidth: number) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  gameMode,
  width,
  onResize,
}) => {
  const [code, setCode] = useState(
    `function twoSum(nums: number[], target: number): number[] {
   // Write your solution here
}`
  );
  const isResizing = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    setShowOverlay(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    // Ensure the new width is within reasonable bounds
    if (newWidth > 300 && newWidth < window.innerWidth * 0.8) {
      onResize(newWidth);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    setShowOverlay(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  // Define custom themes for Monaco Editor
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("light-theme", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#F2FAF4",
      },
    });

    monaco.editor.defineTheme("dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0D1117",
      },
    });
  };

  const isDarkMode = true; //document.documentElement.classList.contains("dark");

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] bg-light-background dark:bg-dark-background flex-1"
      style={{ width: `${width}px`, minWidth: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-gray-400 dark:hover:bg-gray-500 z-10"
        onMouseDown={startResizing}
      />

      {/* Monaco Editor */}
      <div className="h-full flex flex-col">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-light-border dark:border-dark-border">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={code}
          onChange={(value) => setCode(value || "")}
          theme={isDarkMode ? "dark-theme" : "light-theme"}
          beforeMount={handleEditorWillMount}
          options={{
            fontSize: 14,
            lineHeight: 24,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Overlay to prevent text selection while resizing */}
      {showOverlay && <div className="fixed inset-0 z-50 cursor-ew-resize" />}
    </div>
  );
};

export default CodeEditor;

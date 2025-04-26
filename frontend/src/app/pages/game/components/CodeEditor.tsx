  import React, { useState, useRef, useEffect } from "react";
  import { GameMode } from "../../../../types/game/game";
  import Editor, { Monaco } from "@monaco-editor/react";
  import { useMatchConfig } from "../../../hooks/useMatchConfig";
  import useScreen from "../../../../hooks/useScreen";
  import { Fullscreen, Minimize } from "lucide-react";

  interface CodeEditorProps {
    gameMode: GameMode;
    width?: number;
    onResize?: (newWidth: number) => void;
    starterCode: string | undefined;
    currentCode?: string | undefined;
    onCodeChange?: (solution: string) => void;
    isReadOnly?: boolean;
  }

  const CodeEditor: React.FC<CodeEditorProps> = ({
    gameMode,
    width,
    onResize,
    starterCode,
    currentCode,
    onCodeChange,
    isReadOnly,
  }) => {
    const [code, setCode] = useState("");
    const isResizing = useRef(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { matchConfig } = useMatchConfig();
    const { isMobile } = useScreen();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
      if (starterCode !== undefined) {
        setCode(starterCode);
      }
    }, [starterCode]);

    useEffect(() => {
      if (currentCode !== undefined) {
        setCode(currentCode);
      }
    }, [currentCode]);

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
        onResize ? onResize(newWidth) : null;
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

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
      if (containerRef.current) {
        if (!isFullscreen) {
          if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    // Listen for fullscreen change events
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement === containerRef.current);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
        className="relative h-full bg-light-background dark:bg-dark-background flex-1"
        style={{ width: `${width}px`, minWidth: `${width}px` }}
      >
        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-gray-400 dark:hover:bg-gray-500 z-10"
          onMouseDown={startResizing}
        />

        {/* Fullscreen Button */}
        <button
          className={`absolute right-1 top-0 p-1 bg-light-background dark:bg-gray-800 text-light-primary dark:text-dark-primary rounded hover:scale-105 z-20`}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Fullscreen size={18} />}
        </button>

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
            height={isFullscreen ? "100vh" : "100%"}
            language={matchConfig?.language}
            defaultLanguage={matchConfig?.language || "typescript"}
            value={code}
            onChange={(value) => {
              setCode(value || "");
              onCodeChange ? onCodeChange(value!) : null;
            }}
            theme={isDarkMode ? "dark-theme" : "light-theme"}
            beforeMount={handleEditorWillMount}
            options={{
              fontSize: isMobile ? 12 : 14,
              lineHeight: 24,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              formatOnPaste: true,
              formatOnType: true,
              readOnly: isReadOnly,
              lineNumbers: isMobile ? "off" : "on",
            }}
          />
        </div>

        {/* Overlay to prevent text selection while resizing */}
        {showOverlay && <div className="fixed inset-0 z-50 cursor-ew-resize" />}
      </div>
    );
  };

  export default CodeEditor;

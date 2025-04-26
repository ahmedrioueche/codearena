import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Download,
  Trash2,
  Pen,
  Fullscreen,
  Minimize,
} from "lucide-react";
import useScreen from "../../../../hooks/useScreen";
import IconButton from "../../../../components/ui/IconButton";

interface BoardProps {
  gameMode: "solo" | "multiplayer";
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type Coordinates = {
  offsetX: number;
  offsetY: number;
};

const Board: React.FC<BoardProps> = ({
  gameMode,
  isCollapsed,
  onToggleCollapse,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isEraser, setIsEraser] = useState<boolean>(true);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const { isMobile } = useScreen();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Initialize canvas context with proper dimensions
  const initializeCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    // Set canvas dimensions based on device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;

    // Scale canvas CSS dimensions
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;

    // Scale context to match device pixel ratio
    ctx.scale(dpr, dpr);

    // Configure context
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = isMobile ? 4 : 2; // Thicker lines on mobile

    setContext(ctx);

    // Set initial color
    ctx.strokeStyle = isEraser
      ? document.documentElement.classList.contains("dark")
        ? "#0D1117"
        : "#F2FAF4"
      : document.documentElement.classList.contains("dark")
      ? "#FFFFFF"
      : "#000000";
  };

  // Initialize context when component mounts or when collapsed state changes
  useEffect(() => {
    if (!isCollapsed) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeCanvasContext, 50);
    }
  }, [isCollapsed]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isCollapsed) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const container = containerRef.current;
      if (!container) return;

      // Save current drawing
      let prevImageData;
      try {
        prevImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error("Failed to get image data:", e);
      }

      const dpr = window.devicePixelRatio || 1;
      const newWidth = container.clientWidth * dpr;
      const newHeight = container.clientHeight * dpr;

      // Only resize if dimensions actually changed
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;

        ctx.scale(dpr, dpr);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = isMobile ? 4 : 2;

        // Adjust drawing color
        ctx.strokeStyle = isEraser
          ? document.documentElement.classList.contains("dark")
            ? "#0D1117"
            : "#F2FAF4"
          : document.documentElement.classList.contains("dark")
          ? "#FFFFFF"
          : "#000000";

        // Restore drawing if possible
        if (prevImageData) {
          try {
            ctx.putImageData(prevImageData, 0, 0);
          } catch (e) {
            console.error("Failed to restore image data:", e);
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, isEraser, isMobile]);

  // Update drawing color when eraser state changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = isEraser
        ? document.documentElement.classList.contains("dark")
          ? "#0D1117"
          : "#F2FAF4"
        : document.documentElement.classList.contains("dark")
        ? "#FFFFFF"
        : "#000000";
    }
  }, [isEraser, context]);

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent
  ): Coordinates => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        offsetX: (touch.clientX - rect.left) * dpr,
        offsetY: (touch.clientY - rect.top) * dpr,
      };
    }

    return {
      offsetX: e.nativeEvent.offsetX * dpr,
      offsetY: e.nativeEvent.offsetY * dpr,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !canvasRef.current) return;

    // Save current state BEFORE starting new drawing
    const imageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setUndoStack((prev) => [...prev, imageData]);
    setRedoStack([]); // Clear redo stack on new action

    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !isDrawing || !canvasRef.current) return;

    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;

    // Save current state BEFORE clearing
    const imageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setUndoStack((prev) => [...prev, imageData]);
    setRedoStack([]);

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `drawing-${new Date().toISOString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading canvas:", error);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    draw(e);
  };

  const undo = () => {
    if (undoStack.length === 0 || !context || !canvasRef.current) return;

    // Save current state for redo
    const currentImageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setRedoStack((prev) => [...prev, currentImageData]);

    // Restore previous state
    const lastImageData = undoStack[undoStack.length - 1];
    context.putImageData(lastImageData, 0, 0);

    // Update undo stack
    setUndoStack((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0 || !context || !canvasRef.current) return;

    // Save current state for undo
    const currentImageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setUndoStack((prev) => [...prev, currentImageData]);

    // Restore next state
    const nextImageData = redoStack[redoStack.length - 1];
    context.putImageData(nextImageData, 0, 0);

    // Update redo stack
    setRedoStack((prev) => prev.slice(0, -1));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error(`Error exiting fullscreen: ${err.message}`);
      });
    } else {
      container.requestFullscreen().catch((err) => {
        console.error(`Error entering fullscreen: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      // Reinitialize canvas after fullscreen change
      setTimeout(initializeCanvasContext, 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Add keyboard shortcuts for undo/redo functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if board is visible and not collapsed
      if (isCollapsed) return;

      // Check if ctrl key is pressed
      if (e.ctrlKey) {
        // Undo: Ctrl+Z
        if (e.key === "z") {
          e.preventDefault(); // Prevent browser's default undo
          undo();
        }
        // Redo: Ctrl+Y
        else if (e.key === "y") {
          e.preventDefault(); // Prevent browser's default redo
          redo();
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCollapsed, undoStack, redoStack]); // Re-add when these dependencies change

  const buttons = [
    {
      id: "fullscreen",
      icon: isFullScreen ? Minimize : Fullscreen,
      onClick: toggleFullscreen,
      label: "Toggle fullscreen",
      ariaLabel: "Toggle fullscreen",
      ariaPressed: isFullScreen,
    },
    {
      id: "eraser",
      icon: isEraser ? Pen : Eraser,
      onClick: () => setIsEraser(!isEraser),
      label: isEraser ? "Switch to pen" : "Switch to eraser",
      ariaLabel: isEraser ? "Switch to pen" : "Switch to eraser",
      ariaPressed: isEraser,
    },

    {
      id: "clear",
      icon: Trash2,
      onClick: clearCanvas,
      label: "Clear canvas",
      ariaLabel: "Clear canvas",
      ariaPressed: false,
    },
    {
      id: "download",
      icon: Download,
      onClick: downloadCanvas,
      label: "Download drawing",
      ariaLabel: "Download drawing",
      ariaPressed: false,
    },
  ];

  // Add collapse button only when not in fullscreen
  if (!isFullScreen) {
    buttons.push({
      id: "collapse",
      icon: isCollapsed ? ChevronLeft : ChevronRight,
      onClick: onToggleCollapse,
      label: isCollapsed ? "Expand drawing board" : "Collapse drawing board",
      ariaLabel: isCollapsed
        ? "Expand drawing board"
        : "Collapse drawing board",
      ariaPressed: isCollapsed,
    });
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-full"
      } ${
        isFullScreen
          ? "fixed inset-0 z-[100] bg-light-background dark:bg-dark-background"
          : ""
      }`}
      role="region"
      aria-label="Drawing board"
    >
      {/* Toolbar - positioned differently based on fullscreen and mobile */}
      <div
        className={`z-[101] flex ${
          isMobile && !isCollapsed
            ? "fixed bottom-4 left-1/2 -translate-x-1/2 flex-row rounded-full bg-light-background/90 dark:bg-dark-background/90 p-2 shadow-lg"
            : "absolute left-2 top-2 flex-col gap-2"
        } ${isCollapsed ? "hidden" : ""}`}
      >
        {buttons.map((button) => (
          <IconButton
            key={button.id}
            onClick={button.onClick}
            ariaLabel={button.ariaLabel}
            ariaPressed={button.ariaPressed}
            icon={button.icon}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className={`h-full w-full bg-light-background dark:bg-dark-background
              border-2 border-light-border dark:border-dark-border
              ${isCollapsed ? "hidden" : "block"}
              ${isEraser ? "cursor-crosshair" : "cursor-pen"}
              ${isFullScreen ? "!h-screen !w-screen" : ""}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
        aria-hidden="true"
      />
    </div>
  );
};

export default Board;

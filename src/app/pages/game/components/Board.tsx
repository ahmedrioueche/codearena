import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Download,
  Trash2,
} from "lucide-react";

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
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [cursorPosition, setCursorPosition] = useState<Coordinates | null>(
    null
  );
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Initialize canvas context with proper dimensions
  const initializeCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Set canvas dimensions
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Configure context
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    // Store the context
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
      initializeCanvasContext();
    }
  }, [isCollapsed]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isCollapsed) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const prevImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;

        try {
          ctx.putImageData(prevImageData, 0, 0);
        } catch (e) {
          console.error("Failed to restore image data:", e);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed]);

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
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    }

    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
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

  // const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
  //   if (!context) return;
  //
  //   const { offsetX, offsetY } = getCoordinates(e);
  //   context.beginPath();
  //   context.moveTo(offsetX, offsetY);
  //   setIsDrawing(true);
  // };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !isDrawing || !canvasRef.current) return;

    const { offsetX, offsetY } = getCoordinates(e);
    setCursorPosition({ offsetX, offsetY });

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack]);

  return (
    <div
      className={`relative h-full transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-full"
      }`}
      role="region"
      aria-label="Drawing board"
      onMouseMove={draw}
      onMouseLeave={() => setCursorPosition(null)}
    >
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-2">
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`p-2 rounded-lg transition-colors duration-200
                     ${
                       isEraser
                         ? "bg-light-accent dark:bg-dark-accent ring-2 ring-blue-500"
                         : "bg-light-primary dark:bg-dark-primary"
                     }
                     text-light-foreground dark:text-dark-foreground`}
          aria-label={isEraser ? "Switch to pen" : "Switch to eraser"}
          aria-pressed={isEraser}
        >
          <Eraser size={20} />
        </button>
        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary 
                   hover:bg-light-secondary dark:hover:bg-dark-secondary
                   text-light-foreground dark:text-dark-foreground
                   transition-colors duration-200"
          aria-label="Clear canvas"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={downloadCanvas}
          className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary 
                   hover:bg-light-secondary dark:hover:bg-dark-secondary
                   text-light-foreground dark:text-dark-foreground
                   transition-colors duration-200"
          aria-label="Download drawing"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary 
                   hover:bg-light-secondary dark:hover:bg-dark-secondary
                   text-light-foreground dark:text-dark-foreground
                   transition-colors duration-200"
          aria-label={
            isCollapsed ? "Expand drawing board" : "Collapse drawing board"
          }
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className={`h-full w-full bg-light-background dark:bg-dark-background
                  border-2 border-light-border dark:border-dark-border
                  ${isCollapsed ? "hidden" : "block"}
                  ${isEraser ? "cursor-crosshair" : "cursor-pen"}`}
        onMouseDown={startDrawing}
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

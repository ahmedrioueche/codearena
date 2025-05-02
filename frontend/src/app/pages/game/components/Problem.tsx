import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  Maximize2,
  Award,
} from "lucide-react";
import {
  GameMode,
  Problem as ProblemInterface,
} from "../../../../types/game/game";
import useScreen from "../../../../hooks/useScreen";
import { getDifficultyColor } from "../../../../utils/helper";

interface ProblemProps {
  gameMode: GameMode;
  problem: ProblemInterface;
  onGetNewProblem: () => void;
  hints: string[];
  isHintLoading: boolean;
  onGetHint: () => void;
  onOpenProblemModal: () => void;
  isOpenOnMobile: boolean;
}

const Problem: React.FC<ProblemProps> = ({
  problem,
  onGetNewProblem,
  hints,
  isHintLoading,
  onGetHint,
  onOpenProblemModal,
  isOpenOnMobile,
}) => {
  const { isMobile } = useScreen();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [width, setWidth] = useState<number>(
    isMobile ? window.innerWidth : 400
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<ProblemInterface | null>(
    problem
  );

  useEffect(() => {
    setCurrentProblem(problem);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  }, [problem]);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(!isOpenOnMobile);
    }
  }, [isOpenOnMobile]);

  // Toggle collapse state
  const toggleCollapse = () => {
    if (!isCollapsed) {
      // Save the current width before collapsing
      setWidth(containerRef.current?.offsetWidth || 400);
    } else {
      // Reset width to default when expanding
      setWidth(isMobile ? window.innerWidth : 400);
    }
    setIsCollapsed(!isCollapsed);
  };

  // Handle resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;

    const newWidth =
      e.clientX - containerRef.current.getBoundingClientRect().left;
    if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
      // Directly update the DOM for smoother resizing
      containerRef.current.style.width = `${newWidth}px`;
    }
  };

  const stopResizing = () => {
    if (!containerRef.current) return;

    // Update the state with the final width
    setWidth(parseInt(containerRef.current.style.width, 10));
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col transition-all duration-300 ease-in-out overflow-auto pb-10 group
    ${isMobile ? "w-full" : "h-screen"} 
    bg-light-background dark:bg-dark-background border-r border-light-border dark:border-dark-border overflow-y-auto`}
      style={{
        width: isCollapsed ? (isMobile ? "0px" : "44px") : `${width}px`,
        zoom: 0.85,
      }}
    >
      <button
        onClick={toggleCollapse}
        className={`absolute top-3 ${
          isCollapsed ? "right-1" : "right-3"
        } p-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!isCollapsed && (
        <button
          onClick={onOpenProblemModal}
          className="absolute top-3 right-12 p-2 bg-light-primary dark:bg-dark-primary 
        text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Maximize2 size={16} />
        </button>
      )}

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
          onMouseDown={startResizing}
        />
      )}

      {/* Problem Content */}
      {!isCollapsed && (
        <div className="p-6 overflow-auto">
          {currentProblem ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  {currentProblem.title}
                </h1>
              </div>

              <div className="flex gap-4 mb-6">
                <span
                  className={`flex items-center gap-1 text-light-accent dark:text-dark-accent ${getDifficultyColor(
                    currentProblem.difficulty
                  )}`}
                >
                  <Star size={18} className="mb-0.5" />
                  {currentProblem.difficulty.charAt(0).toUpperCase() +
                    currentProblem.difficulty.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-black dark:text-white">
                  <Award size={18} className="mb-0.5" />
                  {problem?.points || "N/A"}
                </span>
                <span className="flex items-center gap-1 text-black dark:text-white">
                  <Clock size={18} className="mb-0.5" />
                  {problem?.averageTime} minutes
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-6">
                  <p className="text-black dark:text-white">
                    {currentProblem.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                    Examples
                  </h2>
                  {currentProblem.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4"
                    >
                      <div className="mb-2 text-black dark:text-white break-words">
                        <span className="font-bold">Input:</span>{" "}
                        <span className="whitespace-pre-wrap overflow-hidden">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-2 text-black dark:text-white break-words">
                        <span className="font-bold">Output:</span>{" "}
                        <span className="whitespace-pre-wrap overflow-hidden">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div className="text-black dark:text-white break-words">
                          <span className="font-bold">Explanation:</span>{" "}
                          <span className="whitespace-pre-wrap overflow-hidden">
                            {example.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                    Constraints
                  </h2>
                  <ul className="list-disc pl-6 text-black dark:text-white">
                    {currentProblem.constraints.map((constraint, index) => (
                      <li key={index} className="mb-1">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hint Section */}
                {hints.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                      Hints
                    </h2>
                    {hints.map((hint, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 text-black dark:text-white"
                      >
                        <strong>Hint {index + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
                    onClick={onGetNewProblem}
                  >
                    <RefreshCw size={18} />
                    New Problem
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-secondary dark:bg-dark-secondary text-white hover:opacity-90 transition-opacity"
                    onClick={onGetHint}
                  >
                    {isHintLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <HelpCircle size={18} />
                    )}
                    Hint
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Show fallback message if no problem is available
            <div className="text-black dark:text-white">
              No problem available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Problem;

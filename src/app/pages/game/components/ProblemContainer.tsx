import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Star,
  Clock,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GameMode, Problem } from "../../../../types/game/game";
import useScreen from "../../../../hooks/useScreen";
import { useProblem } from "../hooks/useProblem";
import { getDifficultyColor } from "../../../../utils/helper";
import { useMatchConfig } from "../../../hooks/useMatchConfig";

const sampleProblem: Problem = {
  id: "two-sum",
  title: "Two Sum",
  topic: "general",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  difficulty: "easy",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
    },
  ],
  constraints: [
    "2 <= nums.length <= 104",
    "-109 <= nums[i] <= 109",
    "-109 <= target <= 109",
  ],
  starterCode:
    "function twoSum(nums: number[], target: number): number[] {\n\n}",
};

interface ProblemContainerProps {
  gameMode: GameMode;
}

const ProblemContainer: React.FC<ProblemContainerProps> = ({ gameMode }) => {
  const { isMobile } = useScreen();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [width, setWidth] = useState<number>(
    isMobile ? window.innerWidth : 400
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { matchConfig } = useMatchConfig();
  const { problem, getProblem } = useProblem(
    matchConfig?.topics.join(","),
    matchConfig?.difficultyLevel
  );
  console.log({ problem });

  const handleGetNewProblem = () => {
    const newProblem = getProblem();
    console.log({ newProblem });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      // Save the current width before collapsing
      setWidth(containerRef.current?.offsetWidth || 400);
    }
  };

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

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col transition-all duration-300 ease-in-out overflow-auto pb-10
        ${isMobile ? "h-[50vh] w-full" : "h-screen"} 
        bg-light-background dark:bg-dark-background border-r border-light-border dark:border-dark-border overflow-y-auto`}
      style={{
        width: isCollapsed ? "44px" : `${width}px`,
        zoom: 0.85,
      }}
    >
      <button
        onClick={toggleCollapse}
        className={`absolute top-3 ${
          isCollapsed ? "right-1" : "right-3"
        } p-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90`}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {sampleProblem.title}
            </h1>
          </div>

          <div className="flex gap-4 mb-6">
            <span
              className={`flex items-center gap-1 ${getDifficultyColor(
                sampleProblem.difficulty
              )}`}
            >
              <Star size={18} />
              {sampleProblem.difficulty.charAt(0).toUpperCase() +
                sampleProblem.difficulty.slice(1)}
            </span>
            <span className="flex items-center gap-1 text-black dark:text-white">
              <Clock size={18} />
              {problem?.averageTime}
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="mb-6">
              <p className="text-black dark:text-white">
                {sampleProblem.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                Examples
              </h2>
              {sampleProblem.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4"
                >
                  <div className="mb-2 text-black dark:text-white">
                    <span className="font-bold">Input:</span> {example.input}
                  </div>
                  <div className="mb-2 text-black dark:text-white">
                    <span className="font-bold">Output:</span> {example.output}
                  </div>
                  {example.explanation && (
                    <div className="text-black dark:text-white">
                      <span className="font-bold">Explanation:</span>{" "}
                      {example.explanation}
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
                {sampleProblem.constraints.map((constraint, index) => (
                  <li key={index} className="mb-1">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
              onClick={() => handleGetNewProblem()}
            >
              <RefreshCw size={18} />
              New Problem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemContainer;

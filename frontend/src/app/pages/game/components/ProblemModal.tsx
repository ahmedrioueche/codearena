import React from "react";
import {
  RefreshCw,
  Star,
  Clock,
  HelpCircle,
  Loader2,
  Code,
  Award,
} from "lucide-react";
import { Problem as ProblemInterface } from "../../../../types/game/game";
import { getDifficultyColor } from "../../../../utils/helper";
import BaseModal from "../../../../components/ui/BaseModal";

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: ProblemInterface | null;
  onGetNewProblem: () => void;
  hints: string[];
  isHintLoading: boolean;
  onGetHint: () => void;
}

const ProblemModal: React.FC<ProblemModalProps> = ({
  isOpen,
  onClose,
  problem,
  onGetNewProblem,
  hints,
  isHintLoading,
  onGetHint,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={problem ? problem.title : "Problem Details"}
      icon={Code}
      width="70vw"
      height="90vh"
    >
      <div className="p-4 overflow-auto">
        {problem ? (
          <>
            <div className="flex gap-4 mb-4 ">
              <span
                className={`flex items-center gap-1 text-light-accent dark:text-dark-accent ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                <Star
                  size={18}
                  className="text-light-accent dark:text-dark-accent mb-0.5"
                />
                {problem.difficulty?.charAt(0).toUpperCase() +
                  problem.difficulty?.slice(1)}
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
            <div className="mb-4">
              <p className="text-black dark:text-white">
                {problem.description}
              </p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
                Examples
              </h2>
              {problem.examples?.map((example, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-2"
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
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
                Constraints
              </h2>
              <ul className="list-disc pl-6 text-black dark:text-white">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="mb-1">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
            {hints.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
                  Hints
                </h2>
                {hints.map((hint, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-2 text-black dark:text-white"
                  >
                    <strong>Hint {index + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}
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
          </>
        ) : (
          <div className="text-black dark:text-white">
            No problem available. Please try again.
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ProblemModal;

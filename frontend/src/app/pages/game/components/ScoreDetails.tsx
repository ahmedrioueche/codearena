import React from "react";
import {
  Problem,
  ScoreBreakdown,
  SolutionValidationResult,
} from "../../../../types/game/game";
import { SCORE_VALUES } from "../../../../constants/game";
import BaseModal from "../../../../components/ui/BaseModal";
import { useScore } from "../hooks/useScore";
import { AlertTriangle } from "lucide-react";

interface ScoreDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  result: SolutionValidationResult;
  hintsCount: number;
  nextLineHelpCount: number;
  timer: number;
  scoreBreakdown?: ScoreBreakdown;
}

const ScoreDetails: React.FC<ScoreDetailsProps> = ({
  isOpen,
  onClose,
  problem,
  result,
  hintsCount,
  nextLineHelpCount,
  timer,
  scoreBreakdown,
}) => {
  const points = problem.points || SCORE_VALUES.defaultPoints;

  const { calculateScore } = useScore();
  const breakdown =
    scoreBreakdown ||
    calculateScore(
      problem.points,
      result,
      hintsCount,
      nextLineHelpCount,
      timer,
      problem.averageTime!
    );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Score Calculation Details"
      width="600px"
      height="90vh"
    >
      <div className="space-y-4">
        {/* Time Over Warning */}
        {breakdown.isTimeOver && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Time Limit Exceeded
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                You exceeded the time limit of {problem.averageTime} minutes.
                Your score has been reset to 0.
              </p>
            </div>
          </div>
        )}

        {/* Correctness */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Correctness ({SCORE_VALUES.correctnessWeight * 100}% of total)
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {result.correctnessPercentage}% correct
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Score: +{breakdown.correctnessScore.toFixed(2)}
          </p>
        </div>

        {/* Efficiency */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Efficiency
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Rating: {result.efficiencyRating}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Score: +{breakdown.efficiencyScore.toFixed(2)}
          </p>
        </div>

        {/* Code Quality */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Code Quality
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Rating: {result.codeQuality}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Score: +{breakdown.codeQualityScore.toFixed(2)}
          </p>
        </div>

        {/* Penalties */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Penalties
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Hints Used: {hintsCount} (Penalty: -
            {breakdown.hintsPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Next-Line Help Used: {nextLineHelpCount} (Penalty: -
            {breakdown.nextLineHelpPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Time Penalty: {Math.max(timer - SCORE_VALUES.timeThreshold, 0)}s
            (Penalty: -{breakdown.timePenalty.toFixed(2)})
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Syntax Mistakes: {result.syntaxMistakesCount} (Penalty: -
            {breakdown.syntaxMistakesPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Logic Mistakes: {result.logicMistakesCount} (Penalty: -
            {breakdown.logicMistakesPenalty.toFixed(2)})
          </p>
        </div>

        {/* Total Score */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Total Score Calculation
          </h3>
          {!breakdown.isTimeOver && (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Base Score: {breakdown.correctnessScore.toFixed(2)}{" "}
                (Correctness)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                + {breakdown.efficiencyScore.toFixed(2)} (Efficiency)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                + {breakdown.codeQualityScore.toFixed(2)} (Code Quality)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                - {breakdown.hintsPenalty.toFixed(2)} (Hints Penalty)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                - {breakdown.nextLineHelpPenalty.toFixed(2)} (Next-Line Help)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                - {breakdown.timePenalty.toFixed(2)} (Time Penalty)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                - {breakdown.syntaxMistakesPenalty.toFixed(2)} (Syntax Mistakes)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                - {breakdown.logicMistakesPenalty.toFixed(2)} (Logic Mistakes)
              </p>
            </>
          )}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Final Score: {breakdown.totalScore.toFixed(2)} / {points}
            </p>
            {breakdown.isTimeOver && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Score set to 0 due to time limit exceeded
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScoreDetails;

import React from "react";
import {
  ScoreBreakdown,
  SolutionValidationResult,
} from "../../../../types/game/game";
import { SCORE_VALUES } from "../../../../constants/game";
import BaseModal from "../../../../components/ui/BaseModal";
import { useScore } from "../hooks/useScore";

interface ScoreDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  problemPoints: number | undefined;
  result: SolutionValidationResult;
  hintsCount: number;
  nextLineHelpCount: number;
  timer: number;
  scoreBreakdown?: ScoreBreakdown;
}

const ScoreDetails: React.FC<ScoreDetailsProps> = ({
  isOpen,
  onClose,
  problemPoints,
  result,
  hintsCount,
  nextLineHelpCount,
  timer,
  scoreBreakdown,
}) => {
  const points = problemPoints || SCORE_VALUES.defaultPoints;

  const { calculateScore } = useScore();
  const breakdown =
    scoreBreakdown ||
    calculateScore(problemPoints, result, hintsCount, nextLineHelpCount, timer);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Score Calculation Details"
      width="600px"
      height="90vh"
    >
      <div className="space-y-4">
        {/* Correctness */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Correctness ({SCORE_VALUES.correctnessWeight * 100}% of total)
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            {result.correctnessPercentage}% correct
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Score: +{breakdown.correctnessScore.toFixed(2)}
          </p>
        </div>

        {/* Efficiency */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Efficiency
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Rating: {result.efficiencyRating}
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Score: +{breakdown.efficiencyScore.toFixed(2)}
          </p>
        </div>

        {/* Code Quality */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Code Quality
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Rating: {result.codeQuality}
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Score: +{breakdown.codeQualityScore.toFixed(2)}
          </p>
        </div>

        {/* Penalties */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Penalties
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Hints Used: {hintsCount} (Penalty: -
            {breakdown.hintsPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Next-Line Help Used: {nextLineHelpCount} (Penalty: -
            {breakdown.nextLineHelpPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Time Penalty: {Math.max(timer - SCORE_VALUES.timeThreshold, 0)}s
            (Penalty: -{breakdown.timePenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Syntax Mistakes: {result.syntaxMistakesCount} (Penalty: -
            {breakdown.syntaxMistakesPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Logic Mistakes: {result.logicMistakesCount} (Penalty: -
            {breakdown.logicMistakesPenalty.toFixed(2)})
          </p>
        </div>

        {/* Total Score */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Total Score Calculation
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Base Score: {breakdown.correctnessScore.toFixed(2)} (Correctness)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            + {breakdown.efficiencyScore.toFixed(2)} (Efficiency)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            + {breakdown.codeQualityScore.toFixed(2)} (Code Quality)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            - {breakdown.hintsPenalty.toFixed(2)} (Hints Penalty)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            - {breakdown.nextLineHelpPenalty.toFixed(2)} (Next-Line Help
            Penalty)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            - {breakdown.timePenalty.toFixed(2)} (Time Penalty)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            - {breakdown.syntaxMistakesPenalty.toFixed(2)} (Syntax Mistakes)
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            - {breakdown.logicMistakesPenalty.toFixed(2)} (Logic Mistakes)
          </p>
          <div className="mt-2 pt-2 border-t border-light-border dark:border-dark-border">
            <p className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
              Final Score: {breakdown.totalScore.toFixed(2)} / {points}
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScoreDetails;

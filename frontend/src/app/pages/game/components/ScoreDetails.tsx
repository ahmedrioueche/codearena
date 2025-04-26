import React from "react";
import { SolutionValidationResult } from "../../../../types/game/game";
import { SCORE_VALUES } from "../../../../constants/game";
import BaseModal from "../../../../components/ui/BaseModal";

interface ScoreDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  problemPoints: number | undefined;
  result: SolutionValidationResult;
  hintsCount: number;
  nextLineHelpCount: number;
  timer: number;
}

const ScoreDetails: React.FC<ScoreDetailsProps> = ({
  isOpen,
  onClose,
  problemPoints,
  result,
  hintsCount,
  nextLineHelpCount,
  timer,
}) => {
  const points = problemPoints || SCORE_VALUES.defaultPoints;

  // Calculate individual score components
  const correctnessScore =
    (result.correctnessPercentage / 100) *
    points *
    SCORE_VALUES.correctnessWeight;

  const efficiencyScore =
    (SCORE_VALUES.efficiencyWeights[result.efficiencyRating] || 0) * points;

  const codeQualityScore =
    (SCORE_VALUES.codeQualityWeights[result.codeQuality] || 0) * points;

  const hintsPenalty = hintsCount * (SCORE_VALUES.penalties.hint * points);
  const nextLineHelpPenalty =
    nextLineHelpCount * (SCORE_VALUES.penalties.nextLineHelp * points);
  const timePenalty =
    Math.max(timer - SCORE_VALUES.timeThreshold, 0) *
    (SCORE_VALUES.penalties.timePerSecond * points);
  const syntaxMistakesPenalty =
    result.syntaxMistakesCount *
    (SCORE_VALUES.penalties.syntaxMistake * points);
  const logicMistakesPenalty =
    result.logicMistakesCount * (SCORE_VALUES.penalties.logicMistake * points);

  const totalScore =
    correctnessScore +
    efficiencyScore +
    codeQualityScore +
    hintsPenalty -
    nextLineHelpPenalty -
    timePenalty -
    syntaxMistakesPenalty -
    logicMistakesPenalty;

  const roundedScore = Math.round(totalScore * 2) / 2;

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
            Correctness
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            {result.correctnessPercentage}% correct
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Score: +{correctnessScore.toFixed(2)}
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
            Score: +{efficiencyScore.toFixed(2)}
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
            Score: +{codeQualityScore.toFixed(2)}
          </p>
        </div>

        {/* Penalties */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Penalties
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Hints Used: {hintsCount} (Penalty: -{hintsPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Next-Line Help Used: {nextLineHelpCount} (Penalty: -
            {nextLineHelpPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Time Penalty: {Math.max(timer - SCORE_VALUES.timeThreshold, 0)}s
            (Penalty: -{timePenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Syntax Mistakes: {result.syntaxMistakesCount} (Penalty: -
            {syntaxMistakesPenalty.toFixed(2)})
          </p>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Logic Mistakes: {result.logicMistakesCount} (Penalty: -
            {logicMistakesPenalty.toFixed(2)})
          </p>
        </div>

        {/* Total Score */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
            Total Score
          </h3>
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Final Score: {roundedScore.toFixed(2)} / {points}
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScoreDetails;

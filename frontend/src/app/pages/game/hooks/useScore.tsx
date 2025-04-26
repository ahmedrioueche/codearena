import { SCORE_VALUES } from "../../../../constants/game";
import {
  GameMode,
  SolutionValidationResult,
} from "../../../../types/game/game";

export const useScore = (gameMode: GameMode) => {
  const calculateScore = (
    problemPoints: number | undefined,
    result: SolutionValidationResult,
    hintsCount: number,
    nextLineHelpCount: number,
    timer: number
  ): number => {
    console.log({ problemPoints });
    console.log({ result });
    console.log({ hintsCount });
    console.log({ nextLineHelpCount });
    console.log({ timer });

    // Use problemPoints if defined, otherwise default to defaultPoints
    const points = problemPoints || SCORE_VALUES.defaultPoints;
    let score = 0;

    // 1. Correctness (50% of the score)
    const correctnessScore =
      (result.correctnessPercentage / 100) *
      points *
      SCORE_VALUES.correctnessWeight;
    score += correctnessScore;

    // 2. Efficiency (20% of the score)
    const efficiencyScore =
      (SCORE_VALUES.efficiencyWeights[result.efficiencyRating] || 0) * points;
    score += efficiencyScore;

    // 3. Code Quality (10% of the score)
    const codeQualityScore =
      (SCORE_VALUES.codeQualityWeights[result.codeQuality] || 0) * points;
    score += codeQualityScore;

    // 4. Penalties
    // Hints Penalty: Subtract 10% of points per hint
    const hintsPenalty = hintsCount * (SCORE_VALUES.penalties.hint * points);
    score -= hintsPenalty;

    // Next Line Help Penalty: Subtract 20% of points per next-line help
    const nextLineHelpPenalty =
      nextLineHelpCount * (SCORE_VALUES.penalties.nextLineHelp * points);
    score -= nextLineHelpPenalty;

    // Time Penalty: Subtract 1% of points per second after threshold
    const timePenalty =
      Math.max(timer - SCORE_VALUES.timeThreshold, 0) *
      (SCORE_VALUES.penalties.timePerSecond * points);
    score -= timePenalty;

    // 5. Mistakes Penalty: Subtract points for each mistake
    const syntaxMistakesPenalty =
      result.syntaxMistakesCount *
      (SCORE_VALUES.penalties.syntaxMistake * points);
    const logicMistakesPenalty =
      result.logicMistakesCount *
      (SCORE_VALUES.penalties.logicMistake * points);
    score -= syntaxMistakesPenalty + logicMistakesPenalty;

    // Ensure the score is not negative and does not exceed points
    score = Math.min(Math.max(score, 0), points);

    // Round the score to the nearest 0.5 or 1
    const roundedScore = Math.round(score * 2) / 2; // Round to nearest 0.5
    return roundedScore;
  };

  return { calculateScore };
};

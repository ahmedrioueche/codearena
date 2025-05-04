import { SCORE_VALUES } from "../../../../constants/game";
import {
  ScoreBreakdown,
  SolutionValidationResult,
} from "../../../../types/game/game";
export const useScore = () => {
  const calculateScore = (
    problemPoints: number | undefined,
    result: SolutionValidationResult,
    hintsCount: number,
    nextLineHelpCount: number,
    timer: number
  ): ScoreBreakdown => {
    const points = problemPoints || SCORE_VALUES.defaultPoints;

    // Calculate all score components
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
      result.logicMistakesCount *
      (SCORE_VALUES.penalties.logicMistake * points);

    // Calculate total score
    const totalScore = Math.min(
      Math.max(
        correctnessScore +
          efficiencyScore +
          codeQualityScore -
          hintsPenalty -
          nextLineHelpPenalty -
          timePenalty -
          syntaxMistakesPenalty -
          logicMistakesPenalty,
        0
      ),
      points
    );

    // Round all scores to 2 decimal places
    const round = (value: number) => Math.round(value * 100) / 100;

    return {
      correctnessScore: round(correctnessScore),
      efficiencyScore: round(efficiencyScore),
      codeQualityScore: round(codeQualityScore),
      hintsPenalty: round(hintsPenalty),
      nextLineHelpPenalty: round(nextLineHelpPenalty),
      timePenalty: round(timePenalty),
      syntaxMistakesPenalty: round(syntaxMistakesPenalty),
      logicMistakesPenalty: round(logicMistakesPenalty),
      totalScore: round(totalScore),
    };
  };

  return { calculateScore };
};

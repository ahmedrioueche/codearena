import { DifficultyLevel, Problem } from "../../types/game/game";
import { promptAi } from "../../utils/gemini";

export const getProblem = async (
  topic: string,
  difficulty: DifficultyLevel
) => {
  try {
    const prompt = "";
    const response = await promptAi(prompt);
    const problem: Problem = {
      id: "",
      title: "",
      topic: "",
      description: "",
      difficulty: "easy",
      examples: [],
      constraints: [],
      starterCode: "",
    };
    return problem;
  } catch (e) {
    console.log("Error getting problem", e);
  }
};

export const validateSolution = async (
  problemId: string,
  solution: string
): Promise<boolean> => {
  // Replace with actual API call
  const response = await fetch(`/api/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ problemId, solution }),
  });
  if (!response.ok) {
    throw new Error("Failed to validate solution");
  }
  const result = await response.json();
  return result.isValid;
};

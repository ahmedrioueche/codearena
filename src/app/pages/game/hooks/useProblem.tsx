import { useState, useEffect } from "react";
import { DifficultyLevel, Problem } from "../../../../types/game/game";
import {
  getProblem as fetchProblemFromAPI,
  validateSolution,
} from "../../../../api/game/problem";

export const useProblem = (topic: string, difficulty: DifficultyLevel) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const fetchedProblem = await fetchProblemFromAPI(topic, difficulty);
        setProblem(fetchedProblem as Problem);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [topic, difficulty]);

  // Function to manually fetch a problem
  const getProblem = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedProblem = await fetchProblemFromAPI(topic, difficulty);
      setProblem(fetchedProblem as Problem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to validate the user's solution
  const validateUserSolution = async (solution: string) => {
    if (!problem) {
      throw new Error("Problem not loaded");
    }

    try {
      const validationResult = await validateSolution(problem.id, solution);
      return validationResult;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Validation failed");
    }
  };

  return {
    problem,
    loading,
    error,
    getProblem,
    validateUserSolution,
  };
};

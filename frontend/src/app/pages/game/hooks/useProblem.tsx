import { useState } from "react";
import {
  DifficultyLevel,
  Problem,
  ProgrammingLanguageT,
  TestCase,
  SolutionValidationResult,
  TestResult,
} from "../../../../types/game/game";
import {
  AiGetProblem as fetchProblemFromAPI,
  AiGetSolutionChatAnswer,
  AiGetProblemHint,
  AiValidateSolution,
  AiGetNextLine,
  AiGetSolution,
  AiGetTestCases,
  AiGetValidateTestCases,
  AiGetRunTestCases,
  AiGetProblemChatAnswer,
} from "../../../../api/game/problem";

// Utility function to get excluded problems from localStorage
const getExcludedProblems = (): string[] => {
  const excludedProblems = localStorage.getItem("excludedProblems");
  return excludedProblems ? JSON.parse(excludedProblems) : [];
};

// Utility function to set excluded problems in localStorage
const setExcludedProblems = (excludedProblems: string[]) => {
  localStorage.setItem("excludedProblems", JSON.stringify(excludedProblems));
};

export const useProblem = () => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [loadingProblem, setLoadingProblem] = useState<boolean>(true);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to manually fetch a problem
  const getProblem = async (
    topics: string,
    language: string,
    difficulty: DifficultyLevel
  ) => {
    setLoadingProblem(true);
    setError(null);

    try {
      // Get the list of excluded problems
      const excludedProblems = getExcludedProblems();

      // Fetch a new problem, excluding the ones in the list
      const fetchedProblem = await fetchProblemFromAPI(
        topics,
        language,
        difficulty,
        excludedProblems
      );

      // Update the problem state
      setProblem(fetchedProblem as Problem);
      setHints([]); // Clear hints when a new problem is fetched
      return fetchedProblem;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingProblem(false);
    }
  };

  // Function to add a problem to the excluded list
  const excludeProblem = (
    title: string | undefined,
    language: ProgrammingLanguageT | undefined,
    difficulty: DifficultyLevel | undefined
  ) => {
    const problemId = `${title}-${language}-${difficulty}`;
    const excludedProblems = getExcludedProblems();

    if (!excludedProblems.includes(problemId)) {
      const updatedExcludedProblems = [...excludedProblems, problemId];
      setExcludedProblems(updatedExcludedProblems);
    }
  };

  // Function to fetch a hint
  const getHint = async (
    problem: Problem,
    currentSolution: string,
    previousHints: string[]
  ) => {
    setLoadingHint(true);
    setError(null);

    try {
      const hint = await AiGetProblemHint(
        problem!,
        currentSolution,
        previousHints
      );
      setHints((prevHints) => [...prevHints, hint!]);
      return hint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingHint(false);
    }
  };

  // Function to validate the user's solution
  const validateSolution = async (solution: string) => {
    if (!problem) {
      throw new Error("Problem not loaded");
    }

    try {
      const validationResult = await AiValidateSolution(problem, solution);
      return validationResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw new Error(err instanceof Error ? err.message : "Validation failed");
    }
  };

  const getSolutionChatAnswer = async (
    problem: Problem,
    userSolution: string,
    validationResult: SolutionValidationResult,
    question: string
  ): Promise<string> => {
    try {
      const answer = await AiGetSolutionChatAnswer(
        problem,
        userSolution,
        validationResult,
        question
      );

      return answer?.trim() || "No answer available.";
    } catch (e) {
      console.log("Error getting answer", e);
      throw new Error("Failed to get answer");
    }
  };

  const getNextLine = async (problem: Problem, currentCode: string) => {
    try {
      const nextLine = await AiGetNextLine(problem, currentCode);
      return nextLine;
    } catch (e) {
      console.log("Error getting next line", e);
      throw new Error("Failed to get next line");
    }
  };

  const getSolution = async (problem: Problem): Promise<string> => {
    try {
      const solution = await AiGetSolution(problem);
      return solution;
    } catch (e) {
      console.log("Error getting solution", e);
      throw new Error("Failed to get solution");
    }
  };

  const getTestCases = async (problem: Problem): Promise<TestCase[]> => {
    try {
      const testCases = await AiGetTestCases(problem);
      return testCases;
    } catch (e) {
      console.log("Error getting test cases", e);
      throw new Error("Failed to get test cases");
    }
  };

  const validateTestCases = async (
    testCases: TestCase[],
    problem: Problem
  ): Promise<TestCase[]> => {
    try {
      const validationResult = await AiGetValidateTestCases(testCases, problem);
      return validationResult;
    } catch (e) {
      console.log("Error validating test cases", e);
      throw new Error("Failed to validate test cases");
    }
  };

  const runTestCases = async (
    problem: Problem,
    testCases: TestCase[],
    solution: string
  ): Promise<TestResult[]> => {
    try {
      const validationResult = await AiGetRunTestCases(
        problem,
        testCases,
        solution
      );
      return validationResult;
    } catch (e) {
      console.log("Error running test cases", e);
      throw new Error("Failed to running test cases");
    }
  };

  const getProblemChatAnswer = async (
    problem: Problem,
    question: string
  ): Promise<string> => {
    try {
      const answer = await AiGetProblemChatAnswer(problem, question);

      return answer?.trim() || "No answer available.";
    } catch (e) {
      console.log("Error getting answer", e);
      throw new Error("Failed to get answer");
    }
  };

  return {
    problem,
    hints,
    loadingProblem,
    loadingHint,
    error,
    getProblem,
    getHint,
    getNextLine,
    getSolution,
    getChatAnswer: getSolutionChatAnswer,
    getProblemChatAnswer,
    validateSolution,
    excludeProblem,
    getTestCases,
    validateTestCases,
    runTestCases,
  };
};

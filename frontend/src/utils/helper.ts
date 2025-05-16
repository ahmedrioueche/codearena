import { Award, Clock, Zap } from "lucide-react";
import { DifficultyLevel, GameMode } from "../types/game/game";
import { Language } from "../types/general";

export function capitalize(str?: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getLanguages = (dict: Record<string, any>): Language[] => {
  return Object.keys(dict) as Language[];
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case "easy":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export function cleanAiResponse(response: string | null | undefined): string {
  try {
    // Step 0: Handle null or undefined input
    if (!response) {
      throw new Error("Empty response from AI");
    }

    // Step 1: Remove markdown code block syntax (if present)
    let cleaned = response.replace(/```json\s*|\s*```/g, "").trim();

    // Step 2: Extract JSON content using regex
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    cleaned = jsonMatch[0].trim(); // Extract JSON block

    // Step 3: Fix common JSON formatting issues
    try {
      // Attempt to parse the JSON to check if it's valid
      JSON.parse(cleaned);
      return cleaned; // If valid, return as-is
    } catch (error) {
      // If parsing fails, try minimal fixes
      try {
        // Fix 1: Ensure property names are quoted
        cleaned = cleaned.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

        // Fix 2: Remove trailing commas in objects and arrays
        cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

        // Fix 3: Escape special characters in strings
        cleaned = cleaned
          .replace(/\\/g, "\\\\") // Escape backslashes
          .replace(/\n/g, "\\n") // Escape newlines
          .replace(/"/g, '\\"'); // Escape double quotes

        // Attempt to parse again
        JSON.parse(cleaned);
        return cleaned;
      } catch (finalError) {
        throw new Error(`Invalid JSON after cleaning: ${finalError}`);
      }
    }
  } catch (error) {
    // Handle any unexpected errors gracefully
    console.error("Error cleaning AI response:", error);

    // Return a fallback response or meaningful error message
    return JSON.stringify({
      error: "Failed to process AI response",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export function cleanAiSolutionValidation(
  response: string | null | undefined
): string {
  if (!response) {
    throw new Error("Empty response from AI");
  }

  // Step 1: Remove markdown code block syntax (if present)
  let cleaned = response.replace(/```json\s*|\s*```/g, "").trim();

  // Step 2: Extract JSON content using regex
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No valid JSON found in AI response");
  }

  cleaned = jsonMatch[0].trim(); // Extract JSON block

  // Step 3: Fix common JSON formatting issues
  try {
    // Attempt to parse the JSON to check if it's valid
    JSON.parse(cleaned);
    return cleaned; // If valid, return as-is
  } catch (error) {
    // If parsing fails, try minimal fixes
    try {
      // Fix 1: Ensure property names are quoted
      cleaned = cleaned.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

      // Fix 2: Remove trailing commas in objects and arrays
      cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

      // Fix 3: Escape special characters in strings
      cleaned = cleaned
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/\n/g, "\\n") // Escape newlines
        .replace(/"/g, '\\"'); // Escape double quotes

      // Attempt to parse again
      JSON.parse(cleaned);
      return cleaned;
    } catch (finalError) {
      throw new Error(`Invalid JSON after cleaning: ${finalError}`);
    }
  }
}
export function cleanAiResponseForTestCases(
  response: string | null | undefined
): string {
  try {
    // Step 0: Handle null or undefined input
    if (!response) {
      throw new Error("Empty response from AI");
    }

    // Step 1: Remove markdown code block syntax (if present)
    let cleaned = response.replace(/```json\s*|\s*```/g, "").trim();

    // Step 2: Extract JSON content using regex
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in AI response");
    }

    cleaned = jsonMatch[0].trim(); // Extract JSON array

    // Step 3: Parse the JSON to ensure it's valid
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    console.error("Error cleaning AI response for test cases:", error);
    throw new Error(
      `Failed to clean AI response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export const formatCodeResponse = (code: string) => {
  let cleanedCode = code?.trim() || "";

  // Remove starting ``` and language identifier
  if (cleanedCode.startsWith("```")) {
    // Find the first newline after the opening ```
    const firstNewlineIndex = cleanedCode.indexOf("\n");
    if (firstNewlineIndex !== -1) {
      // Remove everything up to and including the first newline
      cleanedCode = cleanedCode.slice(firstNewlineIndex + 1);
    } else {
      // If there's no newline, just remove the ```
      cleanedCode = cleanedCode.slice(3);
    }
  }

  // Remove ending ```
  if (cleanedCode.endsWith("```")) {
    cleanedCode = cleanedCode.slice(0, -3);
  }
  return cleanedCode;
};
export function convertSeconds(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts = [];
  if (days) parts.push(`${days} days`);
  if (hours) parts.push(`${hours} hours`);
  if (minutes) parts.push(`${minutes} minutes`);
  if (seconds) parts.push(`${seconds} seconds`);

  return parts.join(", ") || "0 seconds";
}
export const formatAIResponse = (response: string): string => {
  const lines = response.split("\n");

  const formattedLines = lines.map((line) => {
    line = line.trim();

    // Handle bullet points with titles to bold
    if (/^[\*•]\s+\*{2}.*\*{2}:/.test(line)) {
      const match = line.match(/^[\*•]\s+\*{2}(.*?)\*{2}:\s*(.*)/);
      if (match) {
        const [, title, content] = match;
        return `• **${title.trim()}**: ${content.trim()}`;
      }
    }
    // Handle regular bullet points
    else if (line.startsWith("*") || line.startsWith("•")) {
      return `• ${line.slice(1).replace(/^\s+/, "").trim()}`;
    }

    return line;
  });

  return formattedLines.join("\n");
};

export const getModeBackground = (mode: GameMode) => {
  switch (mode) {
    case "solo":
      return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20";
    case "battle":
      return "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20";
    case "collab":
      return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20";
    case "save-the-code":
      return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20";
    default:
      return "bg-light-background/90 dark:bg-dark-background/90";
  }
};

export const getModeStats = (mode: GameMode) => {
  switch (mode) {
    case "solo":
      return [
        { icon: Clock, value: "~20 min", label: "Avg. Session" },
        { icon: Award, value: "42", label: "Challenges" },
        { icon: Zap, value: "89%", label: "Success Rate" },
      ];
    case "battle":
      return [
        { icon: Clock, value: "~15 min", label: "Per Match" },
        { icon: Award, value: "5", label: "Win Streak" },
        { icon: Zap, value: "Gold", label: "Top League" },
      ];
    case "collab":
      return [
        { icon: Clock, value: "~45 min", label: "Avg. Session" },
        { icon: Award, value: "8", label: "Active Rooms" },
        { icon: Zap, value: "12", label: "Contributors" },
      ];
    case "save-the-code":
      return [
        { icon: Clock, value: "~30 min", label: "Avg. Session" },
        { icon: Award, value: "15", label: "Challenges" },
        { icon: Zap, value: "75%", label: "Success Rate" },
      ];
    default:
      return [];
  }
};

export function handleRedirect(fallbackUrl: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl = searchParams.get("redirect");
  console.log("redirect:", redirectUrl);
  if (redirectUrl) {
    window.location.href = redirectUrl;
  } else {
    console.warn("Invalid redirect URL:", redirectUrl);

    window.location.href = fallbackUrl;
  }
}

// Basic security validation for redirect URLs
export function isValidRedirect(url: string): boolean {
  try {
    // Only allow relative paths (no external domains)
    return !new URL(url, window.location.origin).href.startsWith("http");
  } catch {
    return false;
  }
}

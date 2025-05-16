import { useState, useCallback } from "react";
import { MatchConfigI } from "../../types/game/game";

const STORAGE_KEY = "match_config";

const defaultConfig: MatchConfigI = {
  gameMode: "solo",
  language: "javascript",
  topics: ["algorithms", "data structure"],
  difficultyLevel: "medium",
  timeLimit: "30",
};

export function useMatchConfig() {
  // Initialize state with data from localStorage or default values
  const [matchConfig, setMatchConfig] = useState<MatchConfigI>(() => {
    try {
      const storedConfig = localStorage.getItem(STORAGE_KEY);
      if (!storedConfig) return defaultConfig;

      const parsedConfig = JSON.parse(storedConfig);

      // Validate the parsed config has all required fields
      if (!isValidMatchConfig(parsedConfig)) {
        console.warn(
          "Invalid config found in localStorage, using default config"
        );
        return defaultConfig;
      }

      return parsedConfig;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultConfig;
    }
  });

  // Save config to localStorage
  const saveConfig = useCallback(
    (newConfig: Partial<MatchConfigI>) => {
      try {
        const updatedConfig = { ...matchConfig, ...newConfig };

        // Validate the updated config
        if (!isValidMatchConfig(updatedConfig)) {
          throw new Error("Invalid config structure");
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
        setMatchConfig(updatedConfig);
        return true;
      } catch (error) {
        console.error("Error saving config:", error);
        return false;
      }
    },
    [matchConfig]
  );

  // Reset config to default values
  const resetConfig = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
      setMatchConfig(defaultConfig);
      return true;
    } catch (error) {
      console.error("Error resetting config:", error);
      return false;
    }
  }, []);

  // Clear config from localStorage
  const clearConfig = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMatchConfig(defaultConfig);
      return true;
    } catch (error) {
      console.error("Error clearing config:", error);
      return false;
    }
  }, []);

  return {
    matchConfig,
    saveConfig,
    resetConfig,
    clearConfig,
  };
}

// Type guard to validate MatchConfig structure
function isValidMatchConfig(config: any): config is MatchConfigI {
  return (
    typeof config === "object" &&
    config !== null &&
    typeof config.language === "string" &&
    Array.isArray(config.topics) &&
    config.topics.every((topic: any) => typeof topic === "string") &&
    typeof config.difficultyLevel === "string" &&
    typeof config.timeLimit === "string"
  );
}

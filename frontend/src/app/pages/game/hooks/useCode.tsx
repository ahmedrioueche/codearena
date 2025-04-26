import { useState, useEffect } from "react";

// Helper function to generate storage key with problem ID
const getStorageKey = (problemId: string) => `saved_code_${problemId}`;

export const useCode = (problemId: string, initialCode: string = "") => {
  const [savedCode, setSavedCode] = useState<string>(initialCode);

  // Load code from localStorage on mount or when problemId changes
  useEffect(() => {
    const storageKey = getStorageKey(problemId);
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode) {
      setSavedCode(savedCode);
    } else {
      setSavedCode(initialCode); // Reset to initial code if no saved code exists
    }
  }, [problemId, initialCode]);

  // Save code to localStorage
  const saveCode = (newCode: string) => {
    const storageKey = getStorageKey(problemId);
    localStorage.setItem(storageKey, newCode);
    setSavedCode(newCode);
  };

  // Get code from localStorage
  const getSavedCode = (): string => {
    const storageKey = getStorageKey(problemId);
    const savedCode = localStorage.getItem(storageKey);
    return savedCode || initialCode;
  };

  // Clear saved code
  const clearCode = () => {
    const storageKey = getStorageKey(problemId);
    localStorage.removeItem(storageKey);
    setSavedCode(initialCode);
  };

  return {
    savedCode,
    saveCode,
    getSavedCode,
    clearCode,
  };
};

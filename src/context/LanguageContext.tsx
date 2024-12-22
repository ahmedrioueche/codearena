import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { dict } from "../utils/dict";
import { getLanguages } from "../utils/helper";
import { Language } from "../types/general";

const LanguageContext = createContext<Language>("en");

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Get system language and set it
    const systemLanguage = navigator.language || "en"; // Default to 'en' if not available
    const shortLanguage = systemLanguage.split("-")[0]; // Extract the language code (e.g., 'en' from 'en-US')

    // If the detected language is not supported, default to 'en'
    if (getLanguages(dict).includes(shortLanguage as Language)) {
      setLanguage(shortLanguage as Language); // Set valid language
    } else {
      setLanguage("en"); // Fallback to 'en'
    }
  }, []);

  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): Language => {
  return useContext(LanguageContext);
};

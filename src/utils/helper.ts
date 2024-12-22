import { Language } from "./dict";

export const getLanguages = (dict: Record<string, any>): Language[] => {
  return Object.keys(dict) as Language[];
};

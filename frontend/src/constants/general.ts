import { Language } from "../types/general";

export const defaultLanguage: Language = "en";

export const validLangs = {
  en: {
    rtl: false,
  },
  fr: {
    rtl: false,
  },
  ar: {
    rtl: true,
  },
};

// Static stars and asteroids
export const stars = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: Math.random() * 2 + 1,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
}));

export const asteroids = Array.from({ length: 3 }).map((_, i) => ({
  id: i,
  size: Math.random() * 20 + 10,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  rotation: Math.random() * 360,
}));

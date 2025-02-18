import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "../../types/general";
import { Language } from "../../types/general";
import { defaultLanguage, validLangs } from "../../constants/general";

export interface SettingsState {
  language: Language;
  theme: Theme;
  isRtl: boolean;
}

const initialState: SettingsState = {
  language: defaultLanguage,
  theme: "system",
  isRtl: validLangs[defaultLanguage].rtl || false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      state.isRtl = validLangs[action.payload].rtl ?? false;

      if (state.isRtl) document.body.classList.add("is-rtl");
      else document.body.classList.remove("is-rtl");
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;

      let enableDark = false;
      switch (action.payload) {
        case "dark":
          enableDark = true;
          break;
        case "light":
          enableDark = false;
          break;
        case "system":
          enableDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          break;
      }

      if (enableDark) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      localStorage.setItem("theme", state.theme);
    },
    resetSettings() {
      return initialState;
    },
  },
});

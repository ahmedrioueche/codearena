import { dict } from "../utils/dict";

export type Language = keyof typeof dict;

export type Theme = "light" | "dark" | "system";

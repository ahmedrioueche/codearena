import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY: string | undefined = process.env.NEXT_PUBLIC_GEMINI_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

const MAIN_PROMPT = `.`;

const geminiGetAnswer = async (prompt: string) => {
  const result = await model?.generateContent(prompt);

  return result?.response.text();
};

export const promptAi = async (prompt: string) => {
  try {
    const fullPrompt = MAIN_PROMPT + " " + prompt;
    const response = geminiGetAnswer(fullPrompt);
    return response;
  } catch (e) {
    console.log(`Failed to prompt AI`, e);
  }
};

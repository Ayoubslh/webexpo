import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "./env.js";

export const createGeminiChatModel = () => {
  return new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    temperature: 0.2
  });
};

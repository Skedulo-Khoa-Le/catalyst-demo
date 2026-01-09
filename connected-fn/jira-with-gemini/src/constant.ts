import { GenerateContentConfig, GoogleGenAI, HttpOptions } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

export const GEMINI_MODEL = "gemini-3-flash-preview";

export const HTTP_OPTION: HttpOptions = {
  timeout: 100000,
};

export const AI_CONFIG: GenerateContentConfig = {
  temperature: 1.0, // Keep at default 1.0 for Gemini 3 (strongly recommended)
  maxOutputTokens: 8192,
  thinkingConfig: {
    thinkingLevel: "low", // Minimizes latency and cost for instruction following
  },
};

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: HTTP_OPTION,
});

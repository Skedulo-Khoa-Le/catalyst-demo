import { GenerateContentConfig, GoogleGenAI, HttpOptions } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

export const GEMINI_MODEL = "gemini-2.0-flash";

export const HTTP_OPTION: HttpOptions = {
  timeout: 100000,
};

export const AI_CONFIG: GenerateContentConfig = {
  temperature: 0.1,
  maxOutputTokens: 8192,
};

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: HTTP_OPTION,
});

import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.geminiApiKey || process.env.GOOGLE_API_KEY;
const mongoUri = process.env.Mongo_uri || process.env.MONGO_URI;

if (!geminiApiKey) {
  throw new Error("Missing required environment variable: geminiApiKey");
}

if (!mongoUri) {
  throw new Error("Missing required environment variable: Mongo_uri");
}

export const env = {
  GEMINI_API_KEY: geminiApiKey,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: mongoUri,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || process.env.MongoDB || "voyage_db"
};

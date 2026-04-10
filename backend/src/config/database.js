import mongoose from "mongoose";
import { env } from "./env.js";


export const connectDatabase = async () => {
  await mongoose.connect(env.MONGO_URI, {
    dbName: env.MONGO_DB_NAME
  }).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
};

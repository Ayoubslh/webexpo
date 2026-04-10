import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { runVoyageAgent } from "./src/agents/agent.js";
import { connectDatabase } from "./src/config/database.js";
import { env } from "./src/config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/agent/run", async (req, res) => {
  try {
    const input = req.body?.input;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        error: "'input' is required and must be a string"
      });
    }

    const output = await runVoyageAgent(input);
    return res.json({ output });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Agent execution failed"
    });
  }
});

const bootstrap = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

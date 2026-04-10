import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { createGeminiChatModel } from "../config/llm.js";
import { AGENT_SYSTEM_PROMPT } from "./system-prompt.js";
import { buildTravelTools } from "../tools/travel-tools.js";

const buildPrompt = () => {
    return ChatPromptTemplate.fromMessages([
        ["system", AGENT_SYSTEM_PROMPT],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad")
    ]);
};

export const createVoyageAgentExecutor = async () => {
    const llm = createGeminiChatModel();
    const tools = buildTravelTools();
    const prompt = buildPrompt();

    const agent = await createToolCallingAgent({
        llm,
        tools,
        prompt
    });

    return new AgentExecutor({
        agent,
        tools,
        verbose: false
    });
};

export const runVoyageAgent = async (input) => {
    try {
        const executor = await createVoyageAgentExecutor();
        const result = await executor.invoke({ input });
        return result.output;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";

        // Some Gemini responses intermittently fail during streamed tool-call parsing.
        // Fallback to a direct model response so the API stays usable.
        if (message.toLowerCase().includes("failed to parse stream")) {
            const llm = createGeminiChatModel();
            const fallbackPrompt = [
                { role: "system", content: AGENT_SYSTEM_PROMPT },
                { role: "user", content: input }
            ];

            const fallback = await llm.invoke(fallbackPrompt);

            if (typeof fallback.content === "string") {
                return fallback.content;
            }

            return JSON.stringify(fallback.content);
        }

        throw error;
    }
};
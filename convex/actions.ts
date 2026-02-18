import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { chatCompletion } from "./lib/openai";

export const handleUserMessage = action({
  args: { body: v.string(), author: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    // 1. Save the user message
    await ctx.runMutation(api.messages.send, {
      body: args.body,
      author: args.author,
      sessionId: args.sessionId,
    });

    // 2. Fetch the conversation context (the last 20 messages)
    const history = await ctx.runQuery(api.messages.getContext, {
      sessionId: args.sessionId,
      count: 20,
    });

    // 3. Format history for OpenAI
    // We reverse history because it's fetched in 'desc' order (newest first)
    // but LLMs expect chronological order (oldest first).
    const chatMessages = history.reverse().map((msg) => ({
      role: msg.author === "Antigravity" ? "assistant" : "user",
      content: msg.body,
    }));

    // 4. Generate a response using OpenAI
    let responseBody: string;
    try {
      responseBody = await chatCompletion(chatMessages);
    } catch (error) {
      console.error("OpenAI Integration Error:", error);
      responseBody = "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later. 🧠❌";
    }

    // 5. Save the agent response
    await ctx.runMutation(api.messages.send, {
      body: responseBody,
      author: "Antigravity",
      sessionId: args.sessionId,
    });
  },
});

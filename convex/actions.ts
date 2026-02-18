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

    // 2. Generate a response using OpenAI
    let responseBody: string;
    try {
      // Pass the current message as a single user message.
      // OpenAI helper will add the system prompt as instructed.
      responseBody = await chatCompletion([{ role: "user", content: args.body }]);
    } catch (error) {
      console.error("OpenAI Integration Error:", error);
      responseBody = "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later. 🧠❌";
    }

    // 3. Save the agent response
    await ctx.runMutation(api.messages.send, {
      body: responseBody,
      author: "Antigravity",
      sessionId: args.sessionId,
    });
  },
});

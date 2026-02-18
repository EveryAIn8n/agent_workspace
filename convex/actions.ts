import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const handleUserMessage = action({
  args: { body: v.string(), author: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    // 1. Save the user message
    await ctx.runMutation(api.messages.send, {
      body: args.body,
      author: args.author,
      sessionId: args.sessionId,
    });

    // 2. Mock Agent thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Generate a response (This is where the real LLM will go later)
    const responseBody = `I received your message: "${args.body}". I am Antigravity, and I am being built to serve you. 🦾`;

    // 4. Save the agent response
    await ctx.runMutation(api.messages.send, {
      body: responseBody,
      author: "Antigravity",
      sessionId: args.sessionId,
    });
  },
});

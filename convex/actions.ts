import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const handleUserMessage = action({
  args: { body: v.string(), author: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    // 1. Save the user message first
    await ctx.runMutation(api.messages.send, {
      body: args.body,
      author: args.author,
      sessionId: args.sessionId,
    });

    // 2. Here is where the "Brain" (me) will eventually plug in.
    // For now, we'll let the frontend handle the trigger, 
    // but we've moved the logic here so I can intercept it.
  },
});

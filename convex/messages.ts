import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: { body: v.string(), author: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", args);
  },
});

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .collect();
  },
});

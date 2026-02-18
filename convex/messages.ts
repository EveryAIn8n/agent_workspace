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
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getContext = query({
  args: { sessionId: v.string(), count: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const count = args.count ?? 20;
    return await ctx.db
      .query("messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(count);
  },
});

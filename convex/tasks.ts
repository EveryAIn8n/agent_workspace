import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("asc").collect();
  },
});

export const add = mutation({
  args: { title: v.string(), status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")) },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").collect();
    await ctx.db.insert("tasks", { ...args, order: tasks.length });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("tasks"), status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

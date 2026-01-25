import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Minimal table for health check / connectivity test
  // Will be expanded in future phases
  healthCheck: defineTable({
    message: v.string(),
    timestamp: v.number(),
  }),
});

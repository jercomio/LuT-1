import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const demoTaskSchema = z.object({
  id: z.string(),
  idx: z.number().optional(),
  identifier: z.string(),
  title: z.string(),
  content: z.string().optional(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  color: z.string().optional(),
});

export type DemoTask = z.infer<typeof demoTaskSchema>;

export const taskSchema = z.object({
  id: z.string(),
  idx: z.number().optional(),
  identifier: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  label: z.string(),
  status: z.string(),
  priority: z.string(),
  aiPriority: z.number().optional(),
  userPriority: z.number().optional(),
  token: z.string().optional(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  dueOfDate: z.coerce.date().optional(),
  userId: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const prioritySchema = z.enum(["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"]);
export type Priority = z.infer<typeof prioritySchema>;

export const statusSchema = z.enum([
  "BACKLOG", 
  "TODO", 
  "IN_PROGRESS", 
  "IN_REVIEW", 
  "DONE", 
  "CANCELED", 
  "DUPLICATE", 
  "ARCHIVED"
]);
export type Status = z.infer<typeof statusSchema>;

export const labelSchema = z.union([
  z.enum([
    "NONE",
    "API",
    "BRAINSTORMING",
    "USER_STORY",
    "DATABASE", 
    "BUG", 
    "FEATURE", 
    "IMPROVEMENT", 
    "REFACTOR", 
    "TEST", 
    "DESIGN", 
    "DEVOPS", 
    "DOC", 
    "RESEARCH", 
    "SECURITY", 
    "PERFORMANCE", 
    "ARCHITECTURE", 
    "UX", 
    "UI", 
    "MARKETING", 
    "SALES", 
    "LEGAL", 
    "FINANCE", 
    "OTHER"
  ]),
  z.string()
]);
export type Label = z.infer<typeof labelSchema>;

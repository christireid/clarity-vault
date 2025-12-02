import { z } from "zod";
import { PromptCategory } from "@prisma/client";

/**
 * Schema for creating a new prompt
 */
export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: z.nativeEnum(PromptCategory).optional().default("OTHER"),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;

/**
 * Schema for updating a prompt
 */
export const updatePromptSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(1)
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  favorite: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;

/**
 * Schema for creating a new version
 */
export const createVersionSchema = z.object({
  promptId: z.string().min(1, "Prompt ID is required"),
  content: z.string().min(1, "Content is required"),
  commitMessage: z
    .string()
    .max(500, "Commit message must be less than 500 characters")
    .optional(),
  branch: z
    .string()
    .max(100, "Branch name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Branch name can only contain letters, numbers, underscores, and hyphens")
    .optional(),
});

export type CreateVersionInput = z.infer<typeof createVersionSchema>;

/**
 * Schema for prompt list query
 */
export const promptListQuerySchema = z.object({
  workspaceId: z.string().min(1),
  filter: z
    .enum(["all", "favorites", "recent", "archived"])
    .optional()
    .default("all"),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sort: z
    .object({
      field: z.enum(["usage", "created", "updated", "title"]),
      direction: z.enum(["asc", "desc"]),
    })
    .optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

export type PromptListQuery = z.infer<typeof promptListQuerySchema>;

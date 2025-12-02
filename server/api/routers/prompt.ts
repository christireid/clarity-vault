import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PromptCategory, type Prisma } from "@prisma/client";

// Type alias for Prisma transaction client
type TxClient = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Regex pattern for extracting variables from prompt content
 * Matches {{variableName}} where variableName starts with letter/underscore
 */
const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/**
 * Extract unique variable names from prompt content
 */
function extractVariables(content: string): string[] {
  const variables: string[] = [];
  let match;
  // Reset regex lastIndex to ensure fresh matching
  VARIABLE_PATTERN.lastIndex = 0;
  while ((match = VARIABLE_PATTERN.exec(content)) !== null) {
    if (match[1] && !variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
}

// Maximum content size (100KB - reasonable for prompt content)
const MAX_CONTENT_SIZE = 100_000;

// Tag validation: must be alphanumeric with hyphens/underscores, no empty strings
const tagSchema = z
  .string()
  .min(1, "Tag cannot be empty")
  .max(50, "Tag must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
    "Tags must start with alphanumeric and contain only letters, numbers, hyphens, underscores"
  );

// Input validation schemas
const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z
    .string()
    .min(1, "Content is required")
    .max(MAX_CONTENT_SIZE, `Content must be less than ${MAX_CONTENT_SIZE} characters`),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(tagSchema).max(10).optional(),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

const updatePromptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(tagSchema).max(10).optional(),
  favorite: z.boolean().optional(),
  archived: z.boolean().optional(),
});

const createVersionSchema = z.object({
  promptId: z.string().min(1),
  content: z
    .string()
    .min(1, "Content is required")
    .max(MAX_CONTENT_SIZE, `Content must be less than ${MAX_CONTENT_SIZE} characters`),
  commitMessage: z.string().max(500).optional(),
  branch: z.string().max(100).optional(),
});

/**
 * Verify user is a member of the workspace
 */
async function verifyWorkspaceMembership(
  db: typeof import("@/server/db/client").db,
  userId: string,
  workspaceId: string
): Promise<void> {
  const membership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this workspace",
    });
  }
}

export const promptRouter = createTRPCRouter({
  /**
   * List prompts with filtering and pagination
   */
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
        filter: z
          .enum(["all", "favorites", "recent", "archived"])
          .optional()
          .default("all"),
        category: z.nativeEnum(PromptCategory).optional(),
        tags: z.array(z.string().min(1).max(50)).optional(),
        search: z
          .string()
          .max(200)
          .transform((s) => s?.trim())
          .optional(),
        sort: z
          .object({
            field: z.enum(["usage", "created", "updated", "title"]),
            direction: z.enum(["asc", "desc"]),
          })
          .optional(),
        cursor: z.string().cuid().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify workspace access
      await verifyWorkspaceMembership(ctx.db, ctx.user.id, input.workspaceId);

      const {
        workspaceId,
        filter,
        category,
        tags,
        search,
        sort,
        cursor,
        limit,
      } = input;

      // Build where clause
      const where: Record<string, unknown> = {
        workspaceId,
        archived: filter === "archived",
      };

      if (filter === "favorites") {
        where.favorite = true;
      }

      if (category) {
        where.category = category;
      }

      if (tags && tags.length > 0) {
        where.tags = { hasEvery: tags };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Build orderBy clause
      const orderBy: Record<string, string> = {};
      if (sort) {
        const fieldMap: Record<string, string> = {
          usage: "usageCount",
          created: "createdAt",
          updated: "updatedAt",
          title: "title",
        };
        orderBy[fieldMap[sort.field] ?? "createdAt"] = sort.direction;
      } else {
        orderBy.updatedAt = "desc";
      }

      const prompts = await ctx.db.prompt.findMany({
        where,
        orderBy,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          currentVersion: {
            select: {
              id: true,
              version: true,
              content: true,
              variables: true,
            },
          },
          _count: {
            select: {
              contexts: true,
              executions: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (prompts.length > limit) {
        const nextItem = prompts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        prompts,
        nextCursor,
      };
    }),

  /**
   * Get a single prompt by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: input.id },
        include: {
          currentVersion: true,
          contexts: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              versions: true,
              executions: true,
              evaluations: true,
            },
          },
        },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      // Verify workspace access
      await verifyWorkspaceMembership(ctx.db, ctx.user.id, prompt.workspaceId);

      return prompt;
    }),

  /**
   * Get version history for a prompt
   */
  getVersionHistory: protectedProcedure
    .input(
      z.object({
        promptId: z.string().min(1),
        branch: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // First verify the prompt exists and user has access
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: input.promptId },
        select: { workspaceId: true },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(ctx.db, ctx.user.id, prompt.workspaceId);

      const versions = await ctx.db.promptVersion.findMany({
        where: {
          promptId: input.promptId,
          branch: input.branch ?? null,
        },
        orderBy: { version: "desc" },
        select: {
          id: true,
          version: true,
          content: true,
          commitMessage: true,
          branch: true,
          variables: true,
          tokenCount: true,
          createdById: true,
          createdAt: true,
        },
      });

      return versions;
    }),

  /**
   * Create a new prompt
   */
  create: protectedProcedure
    .input(createPromptSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify workspace access
      await verifyWorkspaceMembership(ctx.db, ctx.user.id, input.workspaceId);

      const { content, ...promptData } = input;
      const variables = extractVariables(content);

      // Create prompt and initial version in a transaction
      const prompt = await ctx.db.$transaction(async (tx) => {
        // First create the prompt without currentVersionId
        const newPrompt = await tx.prompt.create({
          data: {
            ...promptData,
            authorId: ctx.user.id,
            tags: promptData.tags ?? [],
          },
        });

        // Create the initial version
        const version = await tx.promptVersion.create({
          data: {
            promptId: newPrompt.id,
            content,
            version: 1,
            variables: variables,
            createdById: ctx.user.id,
          },
        });

        // Update prompt with current version
        const updatedPrompt = await tx.prompt.update({
          where: { id: newPrompt.id },
          data: { currentVersionId: version.id },
          include: {
            currentVersion: true,
          },
        });

        return updatedPrompt;
      });

      return prompt;
    }),

  /**
   * Update prompt metadata (not content)
   */
  update: protectedProcedure
    .input(updatePromptSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify prompt exists and user has access
      const existingPrompt = await ctx.db.prompt.findUnique({
        where: { id },
        select: { workspaceId: true },
      });

      if (!existingPrompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(
        ctx.db,
        ctx.user.id,
        existingPrompt.workspaceId
      );

      const prompt = await ctx.db.prompt.update({
        where: { id },
        data,
        include: {
          currentVersion: true,
        },
      });

      return prompt;
    }),

  /**
   * Create a new version of a prompt
   */
  createVersion: protectedProcedure
    .input(createVersionSchema)
    .mutation(async ({ ctx, input }) => {
      const { promptId, content, commitMessage, branch } = input;

      // Verify prompt exists and user has access
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: promptId },
        select: { workspaceId: true },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(ctx.db, ctx.user.id, prompt.workspaceId);

      const variables = extractVariables(content);

      // Use transaction to prevent race conditions on version numbering
      const version = await ctx.db.$transaction(async (tx) => {
        // Get current version number with lock
        const latestVersion = await tx.promptVersion.findFirst({
          where: {
            promptId,
            branch: branch ?? null,
          },
          orderBy: { version: "desc" },
        });

        const newVersionNumber = (latestVersion?.version ?? 0) + 1;

        const newVersion = await tx.promptVersion.create({
          data: {
            promptId,
            content,
            version: newVersionNumber,
            commitMessage,
            branch,
            parentId: latestVersion?.id,
            variables: variables,
            createdById: ctx.user.id,
          },
        });

        // Only update currentVersionId if on main branch
        if (!branch) {
          await tx.prompt.update({
            where: { id: promptId },
            data: { currentVersionId: newVersion.id },
          });
        }

        return newVersion;
      });

      return version;
    }),

  /**
   * Delete a prompt
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Verify prompt exists and user has access
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: input.id },
        select: { workspaceId: true },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(ctx.db, ctx.user.id, prompt.workspaceId);

      await ctx.db.prompt.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Toggle favorite status
   */
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: input.id },
        select: { favorite: true, workspaceId: true },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(ctx.db, ctx.user.id, prompt.workspaceId);

      const updatedPrompt = await ctx.db.prompt.update({
        where: { id: input.id },
        data: { favorite: !prompt.favorite },
      });

      return updatedPrompt;
    }),

  /**
   * Duplicate a prompt
   */
  duplicate: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const originalPrompt = await ctx.db.prompt.findUnique({
        where: { id: input.id },
        include: {
          currentVersion: true,
        },
      });

      if (!originalPrompt || !originalPrompt.currentVersion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      await verifyWorkspaceMembership(
        ctx.db,
        ctx.user.id,
        originalPrompt.workspaceId
      );

      // Create duplicate
      const duplicate = await ctx.db.$transaction(async (tx) => {
        const newPrompt = await tx.prompt.create({
          data: {
            title: `${originalPrompt.title} (Copy)`,
            description: originalPrompt.description,
            category: originalPrompt.category,
            tags: originalPrompt.tags,
            authorId: ctx.user.id,
            workspaceId: originalPrompt.workspaceId,
          },
        });

        const version = await tx.promptVersion.create({
          data: {
            promptId: newPrompt.id,
            content: originalPrompt.currentVersion!.content,
            version: 1,
            variables: originalPrompt.currentVersion!.variables,
            createdById: ctx.user.id,
          },
        });

        const updatedPrompt = await tx.prompt.update({
          where: { id: newPrompt.id },
          data: { currentVersionId: version.id },
          include: { currentVersion: true },
        });

        return updatedPrompt;
      });

      return duplicate;
    }),

  /**
   * Bulk delete prompts (max 100 at a time)
   */
  bulkDelete: protectedProcedure
    .input(
      z.object({
        ids: z
          .array(z.string().min(1))
          .min(1, "At least one ID is required")
          .max(100, "Cannot delete more than 100 prompts at once"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify all prompts exist and belong to workspaces the user has access to
      const prompts = await ctx.db.prompt.findMany({
        where: { id: { in: input.ids } },
        select: { id: true, workspaceId: true },
      });

      if (prompts.length !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more prompts not found",
        });
      }

      // Verify access to all workspaces (use Array.from for Set iteration)
      const workspaceIds = Array.from(new Set(prompts.map((p) => p.workspaceId)));
      for (const workspaceId of workspaceIds) {
        await verifyWorkspaceMembership(ctx.db, ctx.user.id, workspaceId);
      }

      const result = await ctx.db.prompt.deleteMany({
        where: { id: { in: input.ids } },
      });

      return { success: true, count: result.count };
    }),
});

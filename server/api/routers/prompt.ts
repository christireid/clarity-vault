import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { PromptCategory } from "@prisma/client";

// Input validation schemas
const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  description: z.string().optional(),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(z.string()).optional(),
  workspaceId: z.string(),
});

const updatePromptSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.nativeEnum(PromptCategory).optional(),
  tags: z.array(z.string()).optional(),
  favorite: z.boolean().optional(),
  archived: z.boolean().optional(),
});

const createVersionSchema = z.object({
  promptId: z.string(),
  content: z.string().min(1),
  commitMessage: z.string().optional(),
  branch: z.string().optional(),
});

export const promptRouter = createTRPCRouter({
  /**
   * List prompts with filtering and pagination
   */
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
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
      })
    )
    .query(async ({ ctx, input }) => {
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
    .input(z.object({ id: z.string() }))
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

      return prompt;
    }),

  /**
   * Get version history for a prompt
   */
  getVersionHistory: protectedProcedure
    .input(
      z.object({
        promptId: z.string(),
        branch: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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
      const { content, ...promptData } = input;

      // Extract variables from content
      const variablePattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
      const variables: string[] = [];
      let match;
      while ((match = variablePattern.exec(content)) !== null) {
        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
      }

      // Create prompt and initial version in a transaction
      const prompt = await ctx.db.$transaction(async (tx) => {
        // First create the prompt without currentVersionId
        const newPrompt = await tx.prompt.create({
          data: {
            ...promptData,
            authorId: ctx.userId,
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
            createdById: ctx.userId,
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

      // Get current version number
      const latestVersion = await ctx.db.promptVersion.findFirst({
        where: {
          promptId,
          branch: branch ?? null,
        },
        orderBy: { version: "desc" },
      });

      const newVersionNumber = (latestVersion?.version ?? 0) + 1;

      // Extract variables
      const variablePattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
      const variables: string[] = [];
      let match;
      while ((match = variablePattern.exec(content)) !== null) {
        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
      }

      // Create new version and update prompt
      const version = await ctx.db.$transaction(async (tx) => {
        const newVersion = await tx.promptVersion.create({
          data: {
            promptId,
            content,
            version: newVersionNumber,
            commitMessage,
            branch,
            parentId: latestVersion?.id,
            variables: variables,
            createdById: ctx.userId,
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.prompt.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Toggle favorite status
   */
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: input.id },
        select: { favorite: true },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

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
    .input(z.object({ id: z.string() }))
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

      // Create duplicate
      const duplicate = await ctx.db.$transaction(async (tx) => {
        const newPrompt = await tx.prompt.create({
          data: {
            title: `${originalPrompt.title} (Copy)`,
            description: originalPrompt.description,
            category: originalPrompt.category,
            tags: originalPrompt.tags,
            authorId: ctx.userId,
            workspaceId: originalPrompt.workspaceId,
          },
        });

        const version = await tx.promptVersion.create({
          data: {
            promptId: newPrompt.id,
            content: originalPrompt.currentVersion!.content,
            version: 1,
            variables: originalPrompt.currentVersion!.variables,
            createdById: ctx.userId,
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
   * Bulk delete prompts
   */
  bulkDelete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.prompt.deleteMany({
        where: {
          id: { in: input.ids },
        },
      });

      return { success: true, count: input.ids.length };
    }),
});

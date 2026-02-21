import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

/**
 * User preferences schema - explicitly define allowed preferences
 * to prevent arbitrary data storage and potential injection attacks
 */
const userPreferencesSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    language: z.string().max(10).optional(),
    timezone: z.string().max(50).optional(),
    notificationsEnabled: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
    defaultWorkspaceId: z.string().cuid().optional(),
    editorSettings: z
      .object({
        fontSize: z.number().min(8).max(32).optional(),
        tabSize: z.number().min(2).max(8).optional(),
        wordWrap: z.boolean().optional(),
      })
      .optional(),
  })
  .strict(); // Reject unknown properties

export const userRouter = createTRPCRouter({
  /**
   * Get current user profile with workspaces.
   * If the user doesn't exist in the DB yet (first sign-in via Clerk),
   * automatically creates the user record and a default workspace.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    // Fetch user with workspaces
    let user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Auto-create default workspace if user has none
    if (user.workspaces.length === 0) {
      await ctx.db.workspace.create({
        data: {
          name: "Personal",
          slug: `personal-${user.id.slice(0, 8)}`,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });

      // Re-fetch with workspace
      user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          workspaces: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create workspace",
        });
      }
    }

    return user;
  }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        preferences: userPreferencesSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          preferences: input.preferences,
        },
      });

      return user;
    }),
});

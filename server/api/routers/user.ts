import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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
   * Get current user profile with workspaces
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    // ctx.user is already guaranteed by protectedProcedure
    // Fetch fresh data with workspaces included
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    // This should never happen since protectedProcedure ensures user exists
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
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

  /**
   * Sync user from Clerk (called by webhook)
   *
   * SECURITY NOTE: This endpoint should only be called by Clerk webhooks.
   * In production, implement webhook signature verification using CLERK_WEBHOOK_SECRET.
   * See: https://clerk.com/docs/integrations/webhooks
   *
   * TODO: Move to a dedicated webhook handler with signature verification
   * before deploying to production.
   */
  syncFromClerk: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        email: z.string().email(),
        name: z.string().optional(),
        avatarUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clerkId, email, name, avatarUrl } = input;

      // Upsert user
      const user = await ctx.db.user.upsert({
        where: { clerkId },
        update: {
          email,
          name,
          avatarUrl,
        },
        create: {
          clerkId,
          email,
          name,
          avatarUrl,
        },
      });

      // Create default personal workspace if new user
      const hasWorkspace = await ctx.db.workspaceMember.findFirst({
        where: { userId: user.id },
      });

      if (!hasWorkspace) {
        const workspace = await ctx.db.workspace.create({
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

        return { user, workspace };
      }

      return { user };
    }),
});

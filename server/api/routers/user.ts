import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
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

    return user;
  }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        preferences: z.record(z.unknown()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { clerkId: ctx.userId },
        data: {
          preferences: input.preferences,
        },
      });

      return user;
    }),

  /**
   * Sync user from Clerk (called by webhook)
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

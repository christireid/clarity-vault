import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db/client";
import { auth } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";

/**
 * Context type for tRPC procedures
 */
export interface Context {
  db: typeof db;
  clerkUserId: string | null;
  user: User | null;
}

/**
 * Create tRPC context
 * Resolves the database User from Clerk's auth
 */
export const createTRPCContext = async (): Promise<Context> => {
  const { userId: clerkUserId } = await auth();

  let user: User | null = null;

  if (clerkUserId) {
    user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });
  }

  return {
    db,
    clerkUserId,
    user,
  };
};

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Export reusable router and procedure helpers
 */
export const createTRPCRouter = t.router;

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Middleware to enforce authentication
 * Ensures both Clerk auth and database user exist
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found in database. Please sign out and sign in again.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      clerkUserId: ctx.clerkUserId,
      user: ctx.user,
    },
  });
});

/**
 * Protected procedure - requires authentication
 * Provides ctx.user with the full User object
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

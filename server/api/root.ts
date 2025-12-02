import { createTRPCRouter } from "./trpc";
import { promptRouter } from "./routers/prompt";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompt: promptRouter,
  user: userRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

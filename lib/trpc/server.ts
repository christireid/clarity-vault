import "server-only";

import { createTRPCContext, createCallerFactory } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { cache } from "react";

/**
 * Create a tRPC caller for server-side usage
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Get a cached tRPC caller for the current request
 */
export const api = cache(async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
});

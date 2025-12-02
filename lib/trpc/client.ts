"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

/**
 * tRPC React client
 */
export const trpc = createTRPCReact<AppRouter>();

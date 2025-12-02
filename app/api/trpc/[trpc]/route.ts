import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * Allowed origins for CORS
 * In production, this should be set to your app domain(s)
 */
const getAllowedOrigins = (): string[] => {
  const origins = process.env.CORS_ALLOWED_ORIGINS;
  if (origins) {
    return origins.split(",").map((o) => o.trim());
  }
  // Default to app URL or localhost in development
  return [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ];
};

/**
 * Configure CORS headers with origin validation
 */
const setCorsHeaders = (res: Response, req: NextRequest) => {
  const origin = req.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  // Check if the request origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Same-origin requests don't have Origin header
    // Allow the app URL as fallback
    res.headers.set("Access-Control-Allow-Origin", allowedOrigins[0] ?? "");
  }
  // If origin is not allowed, don't set Access-Control-Allow-Origin

  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-trpc-source"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
};

/**
 * Handle OPTIONS request for CORS preflight
 */
export function OPTIONS(req: NextRequest) {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response, req);
  return response;
}

/**
 * tRPC request handler
 */
const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

  setCorsHeaders(response, req);
  return response;
};

export { handler as GET, handler as POST };

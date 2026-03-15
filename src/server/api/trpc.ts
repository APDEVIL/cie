// src/server/api/trpc.ts
import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

/**
 * Creates the tRPC context for each incoming request.
 * Attach NextAuth session here when auth is added.
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  return { db, req, res };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// ─────────────────────────────────────────────
// TRPC INITIALISATION
// ─────────────────────────────────────────────

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Surface Zod validation errors cleanly to the client
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

/** Factory for building routers — used in root.ts and each router file */
export const createTRPCRouter = t.router;

/**
 * Public procedure — no authentication required.
 * When NextAuth is added, create a `protectedProcedure` here
 * that checks session and throws UNAUTHORIZED if missing.
 */
export const publicProcedure = t.procedure;
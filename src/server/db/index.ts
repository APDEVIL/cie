// src/server/db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/env";
import * as schema from "./schema";

// ─────────────────────────────────────────────
// NEON HTTP CLIENT
// ─────────────────────────────────────────────

const sql = neon(env.DATABASE_URL);

// ─────────────────────────────────────────────
// DRIZZLE CLIENT
// Passing schema enables relational query API:
// ctx.db.query.students.findMany({ with: { ... } })
// ─────────────────────────────────────────────

export const db = drizzle(sql, { schema });

export type DB = typeof db;
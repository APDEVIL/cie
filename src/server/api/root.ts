// src/server/api/root.ts
import { createTRPCRouter } from "@/server/api/trpc";
import { studentRouter }    from "@/server/api/routers/student";
import { subjectRouter }    from "@/server/api/routers/subject";
import { cieWrittenRouter } from "@/server/api/routers/cieWritten";
import { cieSkillRouter }   from "@/server/api/routers/cieSkill";
import { ciePathwayRouter } from "@/server/api/routers/ciePathway";

/**
 * AppRouter — single root router that merges all sub-routers.
 * Add new routers here as the app grows.
 */
export const appRouter = createTRPCRouter({
  student:    studentRouter,
  subject:    subjectRouter,
  cieWritten: cieWrittenRouter,   // Epic 1
  cieSkill:   cieSkillRouter,     // Epic 2
  ciePathway: ciePathwayRouter,   // Epic 3
});

/** Type used by the tRPC client — never import the router itself on the client */
export type AppRouter = typeof appRouter;
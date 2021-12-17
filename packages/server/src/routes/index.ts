import { router } from "@trpc/server";
import { testRequestRouter } from "./testRequestRouter";
import { projectRouter } from "./projectRouter";

export type AppRouter = typeof appRouter;

export const appRouter = router()
  .merge("project.", projectRouter)
  .merge("testRequest.", testRequestRouter);

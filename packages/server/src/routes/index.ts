import { testRequestRouter } from "./testRequestRouter";
import { projectRouter } from "./projectRouter";
import { createRouter } from "./helper";

export type AppRouter = typeof appRouter;

export const appRouter = createRouter()
  .merge("project.", projectRouter)
  .merge("testRequest.", testRequestRouter);

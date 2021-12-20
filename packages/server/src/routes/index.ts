import { testRequestRouter } from "./testRequestRouter";
import { projectRouter } from "./projectRouter";
import { createRouter } from "./helper";
import { authRouter } from "./authRouter";

export type AppRouter = typeof appRouter;

export const appRouter = createRouter()
  .merge("auth.", authRouter)
  .merge("project.", projectRouter)
  .merge("testRequest.", testRequestRouter);

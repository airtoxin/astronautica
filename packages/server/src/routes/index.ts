import { testRequestRouter } from "./testRequestRouter";
import { projectRouter } from "./projectRouter";
import { createRouter } from "./helper";
import { authRouter } from "./authRouter";
import { organizationRouter } from "./organizationRouter";

export type AppRouter = typeof appRouter;

export const appRouter = createRouter()
  .merge("auth.", authRouter)
  .merge("organization.", organizationRouter)
  .merge("project.", projectRouter)
  .merge("testRequest.", testRequestRouter);

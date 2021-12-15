import { router } from "@trpc/server";
import { requestSampleRouter } from "./requestSampleRouter";

export type AppRouter = typeof appRouter;

export const appRouter = router().merge("requestSample.", requestSampleRouter);

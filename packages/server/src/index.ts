import { inferAsyncReturnType, router } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { z } from "zod";

export type AppRouter = typeof appRouter;
export type Context = inferAsyncReturnType<typeof createContext>;

const appRouter = router()
  .query("getUser", {
    input: (val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    },
    async resolve(req) {
      return { id: req.input, name: "Bilbo" };
    },
  })
  .mutation("createUser", {
    // validate input with Zod
    input: z.object({ name: z.string().min(5) }),
    async resolve(req) {
      // use your ORM of choice
      return { id: `${Math.random()}`.slice(2), name: req.input.name };
    },
  });

const app = express();

const createContext = () => ({});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(8080);

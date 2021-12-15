import { inferAsyncReturnType } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { appRouter } from "./routes";

export type Context = inferAsyncReturnType<typeof createContext>;

const app = express();
app.use(cors());

const createContext = () => ({});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(8080, () => {
  console.log(`Server listening port 8080`);
});

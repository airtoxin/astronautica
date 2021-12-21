import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { appRouter } from "./routes";
import { createContext } from "./middlewares/context";
import { responseMeta } from "./middlewares/response";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    responseMeta,
  })
);

app.listen(8080, () => {
  console.log(`Server listening port 8080`);
});

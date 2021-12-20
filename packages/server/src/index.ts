import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { appRouter } from "./routes";
import { createContext } from "./context";
import cookie from "cookie";

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
    responseMeta: (req) => {
      if (req.ctx?.type === "loginIdToken") {
        return {
          headers: {
            "Set-Cookie": cookie.serialize(
              "astro.session",
              req.ctx.dashboardSession.id,
              {
                domain: "localhost",
                path: "/",
                sameSite: "lax",
                secure: true,
                httpOnly: true,
              }
            ),
          },
        };
      }
      return {
        headers: {
          "Set-Cookie": cookie.serialize("key", "value", {}),
        },
      };
    },
  })
);

app.listen(8080, () => {
  console.log(`Server listening port 8080`);
});

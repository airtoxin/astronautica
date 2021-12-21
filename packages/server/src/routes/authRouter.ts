import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter()
  .query("session", {
    resolve: async ({ ctx }) => {
      return ctx.auth.type === "authorizeByCookie";
    },
  })
  .mutation("login", {
    resolve: async ({ ctx }) => {
      if (ctx.auth.type !== "authorizeByGoogleLogin")
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return true;
    },
  });

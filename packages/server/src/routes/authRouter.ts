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

      return {
        accountId: ctx.auth.account.id,
        name: ctx.auth.account.name,
        email: ctx.auth.account.email,
      };
    },
  });

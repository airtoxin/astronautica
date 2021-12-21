import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter().mutation("login", {
  resolve: async (req) => {
    if (req.ctx.type !== "loginIdToken")
      throw new TRPCError({ code: "UNAUTHORIZED" });
    return req.ctx.account;
  },
});

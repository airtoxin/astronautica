import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";

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

      if (ctx.auth.organizations.length === 0) {
        // Create default organization and project
        await prisma.organization.create({
          data: {
            name: `Private organization for ${ctx.auth.account.name}`,
            projects: {
              create: {
                name: `Default project`,
              },
            },
            accounts: {
              connect: {
                id: ctx.auth.account.id,
              },
            },
          },
        });
      }

      return true;
    },
  });

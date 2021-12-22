import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";
import { z } from "zod";

export const organizationRouter = createRouter()
  .query("get", {
    input: z.object({
      organizationId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (ctx.auth.type !== "authorizeByCookie")
        throw new TRPCError({ code: "UNAUTHORIZED" });
      const organization = await prisma.organization.findUnique({
        where: {
          id: input.organizationId,
        },
      });
      if (organization == null) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        id: organization.id,
        name: organization.name,
      };
    },
  })
  .query("list", {
    resolve: async ({ ctx }) => {
      if (ctx.auth.type !== "authorizeByCookie")
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const organizations = await prisma.organization.findMany({
        where: {
          accounts: {
            some: {
              id: ctx.auth.account.id,
            },
          },
        },
        include: {
          accounts: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        organizations: organizations.map((organization) => ({
          id: organization.id,
          name: organization.name,
          accounts: organization.accounts.map((account) => ({
            id: account.id,
            name: account.name,
          })),
        })),
      };
    },
  });

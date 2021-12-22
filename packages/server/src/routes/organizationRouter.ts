import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";

export const organizationRouter = createRouter().query("list", {
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

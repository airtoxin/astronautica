import { z } from "zod";
import { prisma } from "../prisma";
import { addDays } from "date-fns";
import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";

export const projectRouter = createRouter().query("list", {
  resolve: async ({ ctx }) => {
    if (ctx.auth.type !== "authorizeByCookie")
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const projects = await prisma.project.findMany({
      where: {
        organizationId: {
          in: ctx.auth.organizations.map((o) => o.id),
        },
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        organizationName: project.organization.name,
      })),
    };
  },
});

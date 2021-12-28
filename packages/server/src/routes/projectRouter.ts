import { prisma } from "../prisma";
import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const projectRouter = createRouter()
  .query("get", {
    input: z.object({
      projectId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (ctx.auth.type !== "authorizeByCookie")
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          organization: true,
          apiKeys: true,
        },
      });
      if (project == null) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        id: project.id,
        name: project.name,
        organizationName: project.organization.name,
        apiKeys: project.apiKeys.map((apiKey) => ({
          id: Math.random(),
          status: apiKey.status,
          description: apiKey.description,
          expiresAt: apiKey.expiresAt,
          createdAt: apiKey.createdAt,
          lastUsedAt: apiKey.lastUsedAt,
        })),
      };
    },
  })
  .query("list", {
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

import { QueryResolvers } from "../graphql-types.gen";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { emptyAccount } from "./Account";
import { emptyOrganization } from "./Organization";
import { emptyProject } from "./Project";

export const Query: Required<QueryResolvers> = {
  viewer: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    return emptyAccount(context.auth.account.id);
  },
  organization: (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    if (context.auth.organizations.some((o) => o.id === args.organizationId))
      throw new ForbiddenError(
        `Organization for id:${args.organizationId} not found`
      );
    return emptyOrganization(args.organizationId);
  },
  organizations: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    return context.auth.organizations.map(({ id }) => emptyOrganization(id));
  },
  project: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    const project = await context.prisma.project.findFirst({
      where: {
        id: args.projectId,
        organizationId: {
          in: context.auth.organizations.map((o) => o.id),
        },
      },
    });
    if (project == null)
      throw new ForbiddenError(`Project for id:${args.projectId} not found`);
    return emptyProject(args.projectId);
  },
  projects: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    if (!context.auth.organizations.some((o) => o.id === args.organizationId))
      throw new ForbiddenError(
        `Project for Organization for id:${args.organizationId} not found`
      );

    const projects = await context.prisma.project.findMany({
      select: {
        id: true,
      },
      where: {
        organizationId:
          args.organizationId == null
            ? {
                in: context.auth.organizations.map((o) => o.id),
              }
            : args.organizationId,
      },
    });
    return projects.map(({ id }) => emptyProject(id));
  },
};

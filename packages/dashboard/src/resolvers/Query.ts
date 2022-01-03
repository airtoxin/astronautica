import { QueryResolvers } from "../graphql-types.gen";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { emptyAccount } from "./Account";
import { emptyOrganization } from "./Organization";
import { emptyProject } from "./Project";
import { emptyTestFile } from "./TestFile";
import { emptyTestRequest } from "./TestRequest";

export const Query: Required<QueryResolvers> = {
  viewer: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    return emptyAccount(context.auth.account.id);
  },
  organization: (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    if (!context.auth.organizations.find((o) => o.id === args.organizationId))
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
    return emptyProject(
      args.projectId,
      emptyOrganization(project.organizationId)
    );
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
        organizationId: true,
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
    return projects.map(({ id, organizationId }) =>
      emptyProject(id, emptyOrganization(organizationId))
    );
  },
  testFile: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);

    const testFile = await context.prisma.testFile.findFirst({
      select: {
        id: true,
        project: {
          select: {
            id: true,
            organizationId: true,
          },
        },
      },
      where: {
        id: args.testFileId,
        project: {
          organizationId: {
            in: context.auth.organizations.map((o) => o.id),
          },
        },
      },
    });
    if (testFile == null)
      throw new ForbiddenError(`TestFile for id:${args.testFileId} not found`);
    return emptyTestFile(
      testFile.id,
      emptyProject(
        testFile.project.id,
        emptyOrganization(testFile.project.organizationId)
      )
    );
  },
  testRequest: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);

    const testRequest = await context.prisma.testRequest.findFirst({
      select: {
        id: true,
        testFile: {
          select: {
            id: true,
            project: {
              select: {
                id: true,
                organizationId: true,
              },
            },
          },
        },
      },
      where: {
        id: args.testRequestId,
        testFile: {
          project: {
            organizationId: {
              in: context.auth.organizations.map((o) => o.id),
            },
          },
        },
      },
    });
    if (testRequest == null)
      throw new ForbiddenError(
        `TestRequest for id:${args.testRequestId} not found`
      );
    return emptyTestRequest(
      testRequest.id,
      emptyTestFile(
        testRequest.testFile.id,
        emptyProject(
          testRequest.testFile.project.id,
          emptyOrganization(testRequest.testFile.project.organizationId)
        )
      )
    );
  },
};

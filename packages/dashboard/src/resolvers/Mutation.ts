import { MutationResolvers } from "../graphql-types.gen";
import { authService } from "../services/AuthService";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { COOKIE_SESSION_KEY } from "../constants";
import cookie from "cookie";
import { emptyProject } from "./Project";
import { emptyTestRequest } from "./TestRequest";

export const Mutation: Required<MutationResolvers> = {
  login: async (parent, args, context) => {
    const idToken = args.idToken;
    const auth = await authService.authorizeByGoogleLogin(idToken);
    if (auth.type !== "authorizeByGoogleLogin")
      throw new AuthenticationError(`Invalid idToken`);

    if (auth.organizations.length === 0) {
      // Create default organization and project
      await context.prisma.organization.create({
        data: {
          name: `Private organization for ${auth.account.name}`,
          projects: {
            create: {
              name: `Default project`,
            },
          },
          accounts: {
            connect: {
              id: auth.account.id,
            },
          },
        },
      });
    }

    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize(COOKIE_SESSION_KEY, auth.dashboardSession.id, {
        domain: "localhost",
        path: "/",
        sameSite: "lax",
        secure: true,
        httpOnly: true,
      })
    );
    return true;
  },
  createProject: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    if (!context.auth.organizations.some((o) => o.id === args.organizationId))
      throw new ForbiddenError(
        `Project for Organization for id:${args.organizationId} not found`
      );

    const { id, organizationId } = await context.prisma.project.create({
      data: {
        organizationId: args.organizationId,
        name: args.projectName,
        apiKeys: {
          create: [
            {
              status: "ENABLE",
              description: args.apiKeyDescription,
              expiresAt: args.apiKeyExpiration,
              createdBy: {
                connect: {
                  id: context.auth.account.id,
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        organizationId: true,
      },
    });
    return emptyProject(id, organizationId);
  },
  addTestRequest: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByApiKey")
      throw new AuthenticationError(`Unauthorized`);

    const testFile = await context.prisma.testFile.upsert({
      create: {
        path: args.testFilePath,
        projectId: context.auth.project.id,
      },
      update: {},
      where: {
        path_projectId: {
          path: args.testFilePath,
          projectId: context.auth.project.id,
        },
      },
    });

    const testRequest = await context.prisma.testRequest.upsert({
      select: {
        id: true,
      },
      create: {
        name: args.requestName,
        preRequest: args.preRequest ? JSON.parse(args.preRequest) : undefined,
        preRequestCallback: args.preRequestCallback,
        request: JSON.parse(args.request),
        response: JSON.parse(args.response),
        testCallback: args.testCallback,
        testFile: {
          connectOrCreate: {
            where: {
              path_projectId: {
                path: args.testFilePath,
                projectId: context.auth.project.id,
              },
            },
            create: {
              path: args.testFilePath,
              projectId: context.auth.project.id,
            },
          },
        },
      },
      update: {
        name: args.requestName,
        preRequest: args.preRequest ? JSON.parse(args.preRequest) : undefined,
        preRequestCallback: args.preRequestCallback,
        request: JSON.parse(args.request),
        response: JSON.parse(args.response),
        testCallback: args.testCallback,
      },
      where: {
        name_testFileId: {
          name: args.requestName,
          testFileId: testFile.id,
        },
      },
    });

    return emptyTestRequest(testRequest.id);
  },
};

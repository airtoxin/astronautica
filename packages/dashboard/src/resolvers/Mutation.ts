import { MutationResolvers } from "../graphql-types.gen";
import { authService } from "../services/AuthService";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { COOKIE_SESSION_KEY } from "../constants";
import cookie from "cookie";
import { emptyProject } from "./Project";
import { emptyTestRequest } from "./TestRequest";
import { emptyOrganization } from "./Organization";
import { emptyTestFile } from "./TestFile";

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
    return emptyProject(id, emptyOrganization(organizationId));
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
        testFile: {
          select: {
            id: true,
            project: true,
          },
        },
      },
      where: {
        name_testFileId: {
          name: args.requestName,
          testFileId: testFile.id,
        },
      },
      create: {
        name: args.requestName,
        preRequest:
          args.preRequest == null
            ? undefined
            : {
                connectOrCreate: {
                  where: {},
                  create: {
                    url: args.preRequest.url,
                    method: args.preRequest.method,
                    headers: args.preRequest.headers,
                  },
                },
              },
        preRequestCallback: args.preRequestCallback,
        request: {
          connectOrCreate: {
            where: {},
            create: {
              url: args.request.url,
              method: args.request.method,
              headers: args.request.headers,
            },
          },
        },
        response: {
          connectOrCreate: {
            where: {},
            create: {
              url: args.response.url,
              body: args.response.body,
              status: args.response.status,
              headers: args.response.headers,
            },
          },
        },
        testCallback: args.testCallback,
        testFile: {
          connect: {
            path_projectId: {
              path: args.testFilePath,
              projectId: context.auth.project.id,
            },
          },
        },
      },
      update: {
        name: args.requestName,
        preRequest:
          args.preRequest == null
            ? undefined
            : {
                connectOrCreate: {
                  where: {},
                  create: {
                    url: args.preRequest.url,
                    method: args.preRequest.method,
                    headers: args.preRequest.headers,
                  },
                },
              },
        preRequestCallback: args.preRequestCallback,
        request: {
          connectOrCreate: {
            where: {},
            create: {
              url: args.request.url,
              method: args.request.method,
              headers: args.request.headers,
            },
          },
        },
        response: {
          connectOrCreate: {
            where: {},
            create: {
              url: args.response.url,
              body: args.response.body,
              status: args.response.status,
              headers: args.response.headers,
            },
          },
        },
        testCallback: args.testCallback,
      },
    });

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

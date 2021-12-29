import { MutationResolvers } from "../graphql-types.gen";
import { authService } from "../services/AuthService";
import { AuthenticationError } from "apollo-server-micro";
import { COOKIE_SESSION_KEY } from "../constants";
import cookie from "cookie";

export const Mutation: MutationResolvers = {
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
};

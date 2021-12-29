import { dataSources } from "./datasources";
import { MicroRequest } from "apollo-server-micro/src/types";
import {
  Account,
  DashboardSession,
  Organization,
  Project,
} from "@prisma/client";
import { COOKIE_SESSION_KEY } from "./constants";
import { authService } from "./services/AuthService";
import cookie from "cookie";
import { prisma } from "./prisma";

export type Context = {
  auth: AuthorizeResult;
  prisma: typeof prisma;
};

export const context = async ({
  req,
}: {
  req: MicroRequest;
}): Promise<Context> => {
  const idToken = req.headers["id-token"];
  if (typeof idToken === "string") {
    const auth = await authService.authorizeByGoogleLogin(idToken);
    if (auth.type !== "unauthorized") return { auth, prisma };
  }

  const parsedCookie = cookie.parse(req.headers.cookie ?? "");
  const sessionId = parsedCookie[COOKIE_SESSION_KEY];
  if (typeof sessionId === "string") {
    const auth = await authService.authorizeByCookie(sessionId);
    if (auth.type !== "unauthorized") return { auth, prisma };
  }

  const authorization = req.headers.authorization;
  if (typeof authorization === "string") {
    const apiKey = authorization.split(" ")[1];
    if (apiKey == null)
      return {
        auth: authService.unauthorized("Invalid Authorization header format"),
        prisma,
      };
    const auth = await authService.authorizeByCookie(apiKey);
    if (auth.type !== "unauthorized") return { auth, prisma };
  }

  return {
    auth: authService.unauthorized(
      "Authentication by id-token, cookie, or api-key is required"
    ),
    prisma,
  };
};

export type GraphqlContextType = Context & {
  dataSources: ReturnType<typeof dataSources>;
};

export type UnauthorizedResult = {
  readonly type: "unauthorized";
  readonly reason: string;
};

export type GoogleLoginAuthorizeResult = {
  readonly type: "authorizeByGoogleLogin";
  readonly dashboardSession: DashboardSession;
  readonly account: Account;
  readonly organizations: Organization[];
};

export type CookieAuthorizeResult = {
  readonly type: "authorizeByCookie";
  readonly account: Account;
  readonly dashboardSession: DashboardSession;
  readonly organizations: Organization[];
};

export type ApiKeyAuthorizeResult = {
  readonly type: "authorizeByApiKey";
  readonly apiKey: string;
  readonly project: Project;
};

export type AuthorizeResult =
  | UnauthorizedResult
  | GoogleLoginAuthorizeResult
  | CookieAuthorizeResult
  | ApiKeyAuthorizeResult;

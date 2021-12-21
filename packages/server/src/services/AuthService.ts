import { prisma } from "../prisma";
import { OAuth2Client } from "google-auth-library";
import { Account, DashboardSession, Project } from "@prisma/client";

const client = new OAuth2Client(process.env.VITE_GOOGLE_LOGIN_CLIENT_ID);

export type UnauthorizedResult = {
  readonly type: "unauthorized";
  readonly reason: string;
};

export type GoogleLoginAuthorizeResult = {
  readonly type: "authorizeByGoogleLogin";
  readonly account: Account;
  readonly dashboardSession: DashboardSession;
};

export type CookieAuthorizeResult = {
  readonly type: "authorizeByCookie";
  readonly account: Account;
  readonly dashboardSession: DashboardSession;
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

export class AuthService {
  async authorizeByGoogleLogin(
    googleLoginIdToken: string
  ): Promise<AuthorizeResult> {
    const ticket = await client.verifyIdToken({
      idToken: googleLoginIdToken,
      audience: process.env.VITE_GOOGLE_LOGIN_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload == null || payload.email == null || payload.name == null)
      return {
        type: "unauthorized",
        reason: "Google login account requires email and name",
      };
    const account = await prisma.account.upsert({
      create: {
        email: payload.email,
        name: payload.name,
        dashboardSessions: {
          create: {},
        },
      },
      where: {
        email: payload.email,
      },
      update: {
        name: payload.name,
        dashboardSessions: {
          // TODO: Add salt
          create: {},
        },
      },
      include: {
        dashboardSessions: true,
      },
    });
    return {
      type: "authorizeByGoogleLogin",
      dashboardSession: account.dashboardSessions[0]!,
      account,
    };
  }

  async authorizeByCookie(cookieSessionId: string): Promise<AuthorizeResult> {
    const dashboardSession = await prisma.dashboardSession.findUnique({
      where: {
        // TODO: salt
        id: cookieSessionId,
      },
      include: {
        account: true,
      },
    });
    return dashboardSession == null
      ? { type: "unauthorized", reason: "Account not found" }
      : {
          type: "authorizeByCookie",
          account: dashboardSession.account,
          dashboardSession,
        };
  }

  async authorizeByApiKey(apiKey: string): Promise<AuthorizeResult> {
    const apiKeyObject = await prisma.apiKey.findFirst({
      where: {
        id: apiKey,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        project: true,
      },
    });
    return apiKeyObject == null
      ? { type: "unauthorized", reason: "Invalid API Key" }
      : {
          type: "authorizeByApiKey",
          apiKey: apiKeyObject.id,
          project: apiKeyObject.project,
        };
  }

  unauthorized(reason: string): UnauthorizedResult {
    return { type: "unauthorized", reason };
  }
}

export const authService = new AuthService();

import { Account, DashboardSession, Project } from "@prisma/client";
import { AnyRouter } from "@trpc/server";
import { prisma } from "../prisma";
import { Request, Response } from "express";
import { NodeHTTPCreateContextFn } from "@trpc/server/adapters/node-http";
import { OAuth2Client } from "google-auth-library";
import cookie from "cookie";

const client = new OAuth2Client(process.env.VITE_GOOGLE_LOGIN_CLIENT_ID);

export type Context =
  | {
      readonly type: "loginIdToken";
      readonly account: Account;
      readonly dashboardSession: DashboardSession;
    }
  | {
      readonly type: "cookie";
      readonly account: Account;
      readonly dashboardSession: DashboardSession;
    }
  | {
      readonly type: "apiKey";
      readonly apiKey: string;
      readonly project: Project;
    }
  | {
      readonly type: "unauthorized";
      readonly reason: string;
    };

export const createContext: NodeHTTPCreateContextFn<
  AnyRouter,
  Request,
  Response
> = async ({ req }): Promise<Context> => {
  const idToken = req.headers["id-token"];
  if (typeof idToken === "string") {
    const ticket = await client.verifyIdToken({
      idToken,
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
      type: "loginIdToken",
      dashboardSession: account.dashboardSessions[0]!,
      account,
    };
  }

  const parsedCookie = cookie.parse(req.headers.cookie ?? "");
  if (typeof parsedCookie["astro.session"] === "string") {
    const sessionId = parsedCookie["astro.session"];
    const dashboardSession = await prisma.dashboardSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        account: true,
      },
    });
    if (dashboardSession == null)
      return { type: "unauthorized", reason: "Account not found" };
    return {
      type: "cookie",
      account: dashboardSession.account,
      dashboardSession,
    };
  }

  const authorization = req.headers.authorization;
  if (typeof authorization === "string") {
    const apiKeyRaw = authorization.split(" ")[1];
    if (apiKeyRaw == null)
      return {
        type: "unauthorized",
        reason: "Invalid Authorization header format",
      };
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyRaw,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        project: true,
      },
    });
    if (apiKey == null)
      return { type: "unauthorized", reason: "Invalid API Key" };
    return {
      type: "apiKey",
      apiKey: apiKey.id,
      project: apiKey.project,
    };
  }

  return {
    type: "unauthorized",
    reason: "Neither id-token nor api-key existed",
  };
};

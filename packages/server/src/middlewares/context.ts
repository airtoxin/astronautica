import { AnyRouter } from "@trpc/server";
import { Request, Response } from "express";
import { NodeHTTPCreateContextFn } from "@trpc/server/adapters/node-http";
import cookie from "cookie";
import { AuthorizeResult, authService } from "../services/AuthService";
import { COOKIE_SESSION_KEY } from "../constants";

export type Context = {
  auth: AuthorizeResult;
};

export const createContext: NodeHTTPCreateContextFn<
  AnyRouter,
  Request,
  Response
> = async ({ req }): Promise<Context> => {
  const idToken = req.headers["id-token"];
  if (typeof idToken === "string") {
    const auth = await authService.authorizeByGoogleLogin(idToken);
    if (auth.type !== "unauthorized") return { auth };
  }

  const parsedCookie = cookie.parse(req.headers.cookie ?? "");
  const sessionId = parsedCookie[COOKIE_SESSION_KEY];
  if (typeof sessionId === "string") {
    const auth = await authService.authorizeByCookie(sessionId);
    if (auth.type !== "unauthorized") return { auth };
  }

  const authorization = req.headers.authorization;
  if (typeof authorization === "string") {
    const apiKey = authorization.split(" ")[1];
    if (apiKey == null)
      return {
        auth: authService.unauthorized("Invalid Authorization header format"),
      };
    const auth = await authService.authorizeByCookie(apiKey);
    if (auth.type !== "unauthorized") return { auth };
  }

  return {
    auth: authService.unauthorized(
      "Authentication by id-token, cookie, or api-key is required"
    ),
  };
};

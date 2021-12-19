import { Project } from "@prisma/client";
import { AnyRouter } from "@trpc/server";
import { prisma } from "./prisma";
import { Request, Response } from "express";
import { NodeHTTPCreateContextFn } from "@trpc/server/adapters/node-http";

export type Context =
  | {
      readonly apiKey?: string;
      readonly reason: string;
      readonly project?: undefined;
    }
  | {
      readonly apiKey?: string;
      readonly reason?: undefined;
      readonly project: Project;
    };

export const createContext: NodeHTTPCreateContextFn<
  AnyRouter,
  Request,
  Response
> = async ({ req }): Promise<Context> => {
  const authorization = req.headers.authorization;
  if (authorization == null) return { reason: "Authorization header required" };
  const apiKey = authorization.split(" ")[1];
  if (apiKey == null) return { reason: "Invalid Authorization header format" };

  const result = await prisma.apiKey.findFirst({
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
  if (result == null) return { apiKey, reason: "Invalid API Key" };

  return {
    project: result.project,
  };
};

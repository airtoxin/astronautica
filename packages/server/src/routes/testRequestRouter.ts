import { prisma } from "../prisma";
import { z } from "zod";
import { createRouter } from "./helper";
import { TRPCError } from "@trpc/server";

export type RequestObject = z.TypeOf<typeof RequestObjectSchema>;
export const RequestObjectSchema = z.object({
  method: z.string(),
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string().nullish(),
});

export type ResponseObject = z.TypeOf<typeof ResponseObjectSchema>;
export const ResponseObjectSchema = z.object({
  url: z.string(),
  status: z.number(),
  body: z.string().nullish(),
  headers: z.record(z.string(), z.string()),
  redirected: z.boolean(),
});

export const TestRequestSchema = z.object({
  name: z.string(),
  preRequest: RequestObjectSchema.nullish(),
  preRequestCallback: z.string().nullish(),
  request: RequestObjectSchema,
  response: ResponseObjectSchema,
  testCallback: z.string().nullish(),
});

export type TestAddRequestData = z.TypeOf<typeof TestAddRequestDataSchema>;
export const TestAddRequestDataSchema = z.object({
  data: z.object({
    path: z.string(),
    testRequest: TestRequestSchema,
  }),
});

export const testRequestRouter = createRouter()
  .query("list", {
    resolve: async ({ ctx }) => {
      if (ctx.auth.type === "unauthorized")
        throw new TRPCError({ code: "UNAUTHORIZED", message: ctx.auth.reason });

      const testFiles = await prisma.testFile.findMany({
        include: {
          testRequests: true,
        },
      });

      return testFiles;
    },
  })
  .mutation("add", {
    input: TestAddRequestDataSchema,
    resolve: async ({ input, ctx }) => {
      const data = input.data;
      if (ctx.auth.type === "unauthorized")
        throw new TRPCError({ code: "UNAUTHORIZED", message: ctx.auth.reason });
      const project =
        ctx.auth.type === "authorizeByApiKey"
          ? ctx.auth.project
          : (() => {
              throw new TRPCError({ code: "UNAUTHORIZED" });
            })();

      const testFile = await prisma.testFile.findUnique({
        select: {
          id: true,
        },
        where: {
          path_projectId: {
            path: data.path,
            projectId: project.id,
          },
        },
      });

      await prisma.testRequest.upsert({
        create: {
          name: data.testRequest.name,
          preRequest: data.testRequest.preRequest ?? undefined,
          preRequestCallback: data.testRequest.preRequestCallback,
          request: data.testRequest.request,
          response: data.testRequest.response,
          testCallback: data.testRequest.testCallback,
          testFile: {
            connectOrCreate: {
              where: {
                path_projectId: {
                  path: data.path,
                  projectId: project.id,
                },
              },
              create: {
                path: data.path,
                projectId: project.id,
              },
            },
          },
        },
        update: {
          name: data.testRequest.name,
          preRequest: data.testRequest.preRequest ?? undefined,
          preRequestCallback: data.testRequest.preRequestCallback,
          request: data.testRequest.request,
          response: data.testRequest.response,
          testCallback: data.testRequest.testCallback,
        },
        where: {
          name_testFileId: {
            name: data.testRequest.name,
            // FIXME: dummy id
            testFileId: testFile?.id ?? "",
          },
        },
      });

      return true;
    },
  });

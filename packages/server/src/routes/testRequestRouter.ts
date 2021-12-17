import { router } from "@trpc/server";
import { prisma } from "../prisma";
import { z } from "zod";

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

export const testRequestRouter = router().mutation("add", {
  input: TestAddRequestDataSchema,
  resolve: async (req) => {
    const data = req.input.data;
    const result = await prisma.testFile.create({
      data: {
        path: data.path,
        testRequests: {
          create: [
            {
              preRequest: data.testRequest.preRequest ?? undefined,
              preRequestCallback: data.testRequest.preRequestCallback,
              request: data.testRequest.request,
              response: data.testRequest.response,
              testCallback: data.testRequest.testCallback,
            },
          ],
        },
      },
      include: {
        testRequests: true,
      },
    });
    console.log("@result", result);
    return true;
  },
});

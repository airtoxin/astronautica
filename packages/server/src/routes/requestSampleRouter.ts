import { router } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";

export const RequestObjectSchema = z.object({
  cache: z.string().nullish(),
  credentials: z.string().nullish(),
  destination: z.string().nullish(),
  headers: z.record(z.string(), z.string()),
  integrity: z.string().nullish(),
  keepalive: z.boolean().nullish(),
  method: z.string(),
  mode: z.string().nullish(),
  redirect: z.string(),
  referrerPolicy: z.string().nullish(),
  url: z.string(),
  body: z.string().nullish(),
  bodyUsed: z.boolean().nullish(),
});

export const ResponseObjectSchema = z.object({
  headers: z.record(z.string(), z.string()),
  ok: z.boolean(),
  redirected: z.boolean(),
  status: z.number(),
  statusText: z.string(),
  type: z.string().nullish(),
  url: z.string(),
  body: z.string().nullish(),
  bodyUsed: z.boolean(),
});

export const RequestSampleRequestSchema = z.object({
  req: RequestObjectSchema,
  preReq: RequestObjectSchema,
  res: ResponseObjectSchema.nullish(),
  preReqCallback: z.string().nullish(),
  testCallback: z.string().nullish(),
});

export const requestSampleRouter = router().mutation("add", {
  input: z.object({
    requestSample: RequestSampleRequestSchema,
  }),
  resolve: async (req) => {
    const { id } = await prisma.requestSample.create({
      data: {
        request: JSON.stringify(req.input.requestSample.req),
        preRequest: JSON.stringify(req.input.requestSample.preReq),
        response: JSON.stringify(req.input.requestSample.res),
        preRequestCallback: req.input.requestSample.preReqCallback,
        testCallback: req.input.requestSample.testCallback,
      },
    });
    const result = await prisma.requestSample.findUnique({
      where: {
        id: id,
      },
    });
    return RequestSampleRequestSchema.strip().safeParse(result);
  },
});

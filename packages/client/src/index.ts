import "isomorphic-fetch";
import { format } from "prettier";
import { AppRouter } from "@astronautica/server/dist/routes";
import { createTRPCClient } from "@trpc/react";

const client = createTRPCClient<AppRouter>({
  url: "http://localhost:8080/trpc",
});

export const request = (
  input: RequestInfo,
  init?: RequestInit
): AstronauticaClient => {
  return new AstronauticaClient(input, init);
};

class AstronauticaClient {
  private req: Request;
  private preReq: Promise<Request>;
  private res: Response | undefined;
  private preReqCallback:
    | ((req: Request) => Request | Promise<Request>)
    | undefined;
  private testCallback: ((res: Response) => unknown) | undefined;

  constructor(private input: RequestInfo, private init?: RequestInit) {
    this.req = new Request(input, init);
    this.preReq = Promise.resolve(this.req.clone());
  }

  preRequest(callback: (req: Request) => Request | Promise<Request>): this {
    this.preReqCallback = callback;
    this.preReq = Promise.resolve(callback(this.req.clone()));
    return this;
  }

  test(callback: (res: Response) => unknown): this {
    this.testCallback = callback;
    return this;
  }

  async run(): Promise<Response> {
    return fetch(this.input, this.init).then(async (res) => {
      this.res = res.clone();
      await this.testCallback?.(res.clone());
      await client.mutation("requestSample.add", {
        requestSample: await this.serialize(),
      });
      return res;
    });
  }

  async serialize() {
    return {
      req: serializeRequest(this.req),
      preReq: serializeRequest(await this.preReq),
      res: await serializeResponse(this.res),
      preReqCallback: serializeCallback(this.preReqCallback),
      testCallback: serializeCallback(this.testCallback),
    };
  }
}

const serializeRequest = (req: Request) => ({
  cache: req.cache,
  credentials: req.credentials,
  destination: req.destination,
  headers: serializeHeaders(req.headers),
  integrity: req.integrity,
  keepalive: req.keepalive,
  method: req.method,
  mode: req.mode,
  redirect: req.redirect,
  referrer: req.referrer,
  referrerPolicy: req.referrerPolicy,
  url: req.url,
  body: req.body == null ? undefined : JSON.stringify(req.body),
  bodyUsed: req.bodyUsed,
});

const serializeResponse = async (res: Response | undefined) =>
  res == null
    ? undefined
    : {
        headers: serializeHeaders(res.headers),
        ok: res.ok,
        redirected: res.redirected,
        status: res.status,
        statusText: res.statusText,
        type: res.type,
        url: res.url,
        body: await res.text(),
        bodyUsed: res.bodyUsed,
      };

const serializeHeaders = (headers: Headers) => {
  const h: { [key: string]: string } = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });
  return h;
};

const serializeCallback = (callback: ((...args: any[]) => any) | undefined) =>
  callback == null ? undefined : format(callback.toString());

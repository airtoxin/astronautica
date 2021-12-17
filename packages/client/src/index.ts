import { fetch, Request, Response, RequestInfo, RequestInit } from "undici";
import { format } from "prettier";
import { AppRouter } from "@astronautica/server/dist/routes";
import { createTRPCClient, TRPCClient } from "@trpc/react";

export const createRequester = (
  serverAddress = "http://localhost:8080/trpc"
): ((input: RequestInfo, init?: RequestInit) => AstronauticaClient) => {
  return (input: RequestInfo, init?: RequestInit): AstronauticaClient => {
    return new AstronauticaClient(serverAddress, input, init);
  };
};

class AstronauticaClient {
  private client: TRPCClient<AppRouter>;
  private req: Request;
  private preReq: Promise<Request>;
  private res: Response | undefined;
  private preReqCallback:
    | ((req: Request) => Request | Promise<Request>)
    | undefined;
  private testCallback: ((res: Response) => unknown) | undefined;

  constructor(
    serverAddress: string,
    private input: RequestInfo,
    private init?: RequestInit
  ) {
    this.client = createTRPCClient<AppRouter>({
      url: serverAddress,
      fetch: fetch as any // almost compatible with fetch
    });
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
      await this.client.mutation("requestSample.add", {
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

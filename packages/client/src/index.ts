import { fetch, Request, RequestInfo, RequestInit, Response } from "undici";
import { format } from "prettier";
import { AppRouter } from "@astronautica/server/dist/routes";
import { createTRPCClient, TRPCClient } from "@trpc/client";
import {
  RequestObject,
  ResponseObject,
  TestAddRequestData,
} from "@astronautica/server/dist/routes/testRequestRouter";

export const createRequester = (
  serverAddress: string
): ((input: RequestInfo, init?: RequestInit) => AstronauticaClient) => {
  return (input: RequestInfo, init?: RequestInit): AstronauticaClient => {
    return new AstronauticaClient(serverAddress, input, init);
  };
};

class AstronauticaClient {
  private readonly client: TRPCClient<AppRouter>;
  private readonly req: Request;
  private preReq: Promise<Request> | undefined;
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
      fetch: fetch as any, // almost compatible with fetch
    });
    this.req = new Request(input, init);
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
      await this.testCallback?.(res.clone());
      await this.client.mutation(
        "testRequest.add",
        await this.serialize(res.clone())
      );
      return res;
    });
  }

  async serialize(res: Response): Promise<TestAddRequestData> {
    const testState = expect.getState();
    return {
      data: {
        path: testState.testPath,
        testRequest: {
          preRequest:
            this.preReq == null
              ? undefined
              : serializeRequest(await this.preReq),
          preRequestCallback: serializeCallback(this.preReqCallback),
          request: serializeRequest(this.req),
          response: await serializeResponse(res),
          testCallback: serializeCallback(this.testCallback),
        },
      },
    };
  }
}

const serializeRequest = (req: Request): RequestObject => ({
  method: req.method,
  url: req.url,
  headers: serializeHeaders(req.headers),
  body: req.body == null ? undefined : JSON.stringify(req.body),
});

const serializeResponse = async (res: Response): Promise<ResponseObject> => ({
  url: res.url,
  status: res.status,
  body: await res.text(),
  headers: serializeHeaders(res.headers),
  redirected: res.redirected,
});

const serializeHeaders = (headers: Headers) => {
  const h: { [key: string]: string } = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });
  return h;
};

const serializeCallback = (callback: ((...args: any[]) => any) | undefined) =>
  callback == null
    ? undefined
    : format(callback.toString(), { parser: "babel" });

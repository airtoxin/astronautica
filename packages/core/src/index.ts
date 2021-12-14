import "isomorphic-fetch";
import { format } from "prettier";

export const request = (
  input: RequestInfo,
  init?: RequestInit
): AstronauticaClient => {
  return new AstronauticaClient(input, init);
};

export const createRequester = (
  recordingServerAddress: string
): typeof request => {
  return (input: RequestInfo, init?: RequestInit): AstronauticaClient => {
    return new AstronauticaClient(input, init, recordingServerAddress);
  };
};

class AstronauticaClient {
  private req: Request;
  private preReq: Request;
  private res: Response | undefined;
  private preReqCallback:
    | ((req: Request) => Request | Promise<Request>)
    | undefined;
  private testCallback: ((res: Response) => unknown) | undefined;

  constructor(
    private input: RequestInfo,
    private init?: RequestInit,
    private recordingServerAddress = "http://localhost:8000"
  ) {
    this.req = new Request(input, init);
    this.preReq = this.req.clone();
  }

  async preRequest(
    callback: (req: Request) => Request | Promise<Request>
  ): Promise<this> {
    this.preReqCallback = callback;
    this.preReq = await callback(this.req);
    return this;
  }

  async test(callback: (res: Response) => unknown): Promise<this> {
    this.testCallback = callback;
    return fetch(this.input, this.init).then(async (res) => {
      this.res = res.clone();
      await callback(res.clone());
      return this;
    });
  }

  serialize() {
    return {
      req: serializeRequest(this.req),
      preReq: serializeRequest(this.preReq),
      res: serializeResponse(this.res),
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
  signal: req.signal,
  url: req.url,
  body: req.body,
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

import "isomorphic-fetch";
import { format } from "prettier";

export const request = (
  input: RequestInfo,
  init?: RequestInit
): Astronautica => {
  return new Astronautica(input, init);
};

class Astronautica {
  constructor(private input: RequestInfo, private init?: RequestInit) {
    const req = new Request(input, init);
    console.log("@req", serializeRequest(req));
  }

  async test(callback: (res: Response) => unknown): Promise<Response> {
    console.log("@callback", format(callback.toString()));
    return fetch(this.input, this.init).then(async (res) => {
      console.log("@res", await serializeResponse(res.clone()));
      await callback(res.clone());
      return res;
    });
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

const serializeResponse = async (res: Response) => ({
  headers: serializeHeaders(res.headers),
  ok: res.ok,
  redirected: res.redirected,
  status: res.status,
  statusText: res.statusText,
  type: res.type,
  url: res.url,
  body: await res.text(),
  bodyUsed: res.bodyUsed,
});

const serializeHeaders = (headers: Headers) => {
  const h: { [key: string]: string } = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });
  return h;
};

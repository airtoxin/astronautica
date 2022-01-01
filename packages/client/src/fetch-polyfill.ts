import { fetch, Request, Response } from "undici";

if (global.fetch == null) {
  global.fetch = fetch as any;
  global.Request = Request as any;
  global.Response = Response as any;
}

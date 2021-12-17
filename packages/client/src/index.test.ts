import { createRequester } from "./index";
import express, { RequestHandler } from "express";
import { Server } from "http";

describe("request", () => {
  const astronauticaApp = express().use(express.json());
  let astronauticaServer: Server | undefined;
  const astronauticaCallbackRef: { callback: RequestHandler } = {
    callback: () => {
      // reset by beforeEach hook
    },
  };
  astronauticaApp.all("/*", (req, res, next) => {
    astronauticaCallbackRef.callback(req, res, next);
  });

  const contentApp = express().use(express.json());
  let contentServer: Server | undefined;
  const contentCallbackRef: { callback: RequestHandler } = {
    callback: () => {
      // reset by beforeEach hook
    },
  };
  contentApp.all("/*", (req, res, next) => {
    contentCallbackRef.callback(req, res, next);
  });

  beforeEach(() => {
    astronauticaCallbackRef.callback = (req, res) => {
      res.send({
        id: null,
        result: {
          type: "data",
          data: {
            id: "1",
            title: "Hello tRPC",
            body: "...",
          },
        },
      });
    };
    contentCallbackRef.callback = (req, res) => {
      res.send("Hello world");
    };

    return Promise.all([
      new Promise<void>((resolve) => {
        astronauticaServer = astronauticaApp.listen(1234, resolve);
      }),
      new Promise<void>((resolve) => {
        contentServer = contentApp.listen(1235, resolve);
      }),
    ]);
  });

  afterEach(() => {
    return Promise.all([
      new Promise<any>((resolve) => astronauticaServer?.close(resolve)),
      new Promise<any>((resolve) => contentServer?.close(resolve)),
    ]);
  });

  it("Astronautica サーバーにリクエストを送信していること", async () => {
    astronauticaCallbackRef.callback = (req, res) => {
      expect(req.body).toMatchObject({
        0: {
          requestSample: expect.any(Object),
        },
      });
      res.send({
        id: null,
        result: {
          type: "data",
          data: {
            id: "1",
            title: "Hello tRPC",
            body: "...",
          },
        },
      });
    };

    const request = createRequester("http://localhost:1234");
    await request("https://example.com").run();

    expect.assertions(1);
  });

  it("コンテンツサーバーへリクエストを実施していること", async () => {
    contentCallbackRef.callback = (req, res) => {
      expect(req.method).toBe("POST");
      expect(req.body).toEqual({ foo: "bar" });
      res.send("OK");
    };

    const request = createRequester("http://localhost:1234");
    await request("http://localhost:1235", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ foo: "bar" }),
    }).run();

    expect.assertions(2);
  });
});

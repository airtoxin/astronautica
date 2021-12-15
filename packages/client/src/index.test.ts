import { createRequester } from "./index";
import fetchMock from "fetch-mock";

describe("request", () => {
  const createDefaultContext = () => {
    const serverAddress = "http://localhost:1234";
    const requestUrl = "https://example.com";
    const mockServerResponseBody = {
      id: null,
      result: {
        type: "data",
        data: {},
      },
    };
    const mockRequestResponse = "mocked response";
    const request = createRequester(serverAddress);
    return {
      request,
      serverAddress,
      requestUrl,
      mockRequestResponse,
      mockServerResponseBody,
    };
  };

  beforeEach(() => {
    const {
      serverAddress,
      requestUrl,
      mockServerResponseBody,
      mockRequestResponse,
    } = createDefaultContext();

    fetchMock.reset();
    fetchMock.post(`begin:${serverAddress}`, {
      status: 200,
      body: mockServerResponseBody,
    });
    fetchMock.get(requestUrl, {
      status: 200,
      body: mockRequestResponse,
    });
  });

  it("Astronautica サーバーにリクエストを送信していること", async () => {
    const { request, serverAddress, requestUrl, mockServerResponseBody } =
      createDefaultContext();

    fetchMock.post(
      `begin:${serverAddress}`,
      (_, req) => {
        expect(typeof req.body).toBe("string");
        return {
          status: 200,
          body: mockServerResponseBody,
        };
      },
      { overwriteRoutes: true }
    );

    await request(requestUrl).run();

    expect.assertions(1);
  });

  it("リクエスト結果を取得できること", async () => {
    const { request, requestUrl, mockRequestResponse } = createDefaultContext();
    const res = await request(requestUrl)
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toBe(mockRequestResponse);
  });
});

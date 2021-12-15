import { request } from "./index";
import fetchMock from "fetch-mock";

describe("request", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.get("https://example.com", {
      status: 200,
      body: "mocked response",
    });
  });

  it("リクエスト結果を取得できること", async () => {
    const res = await request("https://example.com")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toBe("mocked response");
  });
});

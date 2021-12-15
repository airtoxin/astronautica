import { request } from "./index";

describe("request", () => {
  it("リクエスト結果を取得できること", async () => {
    const res = await request("https://example.com")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain("Example Domain");
  });
});

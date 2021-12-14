import { request } from "./index";

describe("request", () => {
  it("test", async () => {
    await request("https://example.com").test((res) => {
      expect(res.status).toBe(200);
    });
  });
});

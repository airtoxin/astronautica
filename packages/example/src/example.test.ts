import { createRequester } from "@astronautica/client/dist";

describe("Astronautica Example", () => {
  jest.setTimeout(30 * 1000);

  const request = createRequester("http://localhost:8080/trpc");

  it("States Current", async () => {
    console.log("@expect", expect.getState());
    await request("https://covidtracking.com/api/states")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
  });

  it("States Daily", async () => {
    console.log("@expect", expect.getState());
    await request("https://covidtracking.com/api/states/daily")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
  });

  it("States Info", async () => {
    console.log("@expect", expect.getState());
    await request("https://covidtracking.com/api/states/info")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
  });

  it("US Current", async () => {
    console.log("@expect", expect.getState());
    await request("http://covidtracking.com/api/us")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
  });

  it("US Daily", async () => {
    console.log("@expect", expect.getState());
    await request("https://covidtracking.com/api/us/daily")
      .test((res) => {
        expect(res.status).toBe(200);
      })
      .run();
  });
});

# Astronautica

## 📦 Install

```shell
npm install -D astronautica
# or using yarn
# yarn add -D astronautica
```

## ⚙️ Usage

```shell
# Open Astronautica devtool
yarn astro open
# Run test
yarn astro run
```

```typescript
import { request } from "@astronautica/core";
describe("My API v3", () => {
  it("List users", async () => {
    await request("/path/to/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hello: "world!" })
    }).test((res) => {
      expect(res.status).toBe(200);
    })
  });
});
```

## ⚒️ Development

```shell
yarn
yarn dev
```

import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "@astronautica/server/dist/routes";
import { getFetch } from "@trpc/client";

export const trpc = createReactQueryHooks<AppRouter>();

export const createTrpcClient = (headers: Record<string, string>) =>
  trpc.createClient({
    url: "http://localhost:8080/trpc",
    fetch: (url, options) =>
      getFetch()(url, {
        ...options,
        mode: "cors",
        credentials: "include",
        headers,
      }),
  });

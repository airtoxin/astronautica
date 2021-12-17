import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "@astronautica/server/dist/routes";

export const trpc = createReactQueryHooks<AppRouter>();

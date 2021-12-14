import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "@astronautica/server";

export const trpc = createReactQueryHooks<AppRouter>();

import { Context } from "../middlewares/context";
import { router } from "@trpc/server";

export const createRouter = () => {
  return router<Context>();
};

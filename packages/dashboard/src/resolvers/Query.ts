import { QueryResolvers } from "../graphql-types.gen";
import { AuthenticationError } from "apollo-server-micro";
import { emptyAccount } from "./Account";

export const Query: QueryResolvers = {
  viewer: async (parent, args, context) => {
    if (context.auth.type !== "authorizeByCookie")
      throw new AuthenticationError(`Unauthorized`);
    return emptyAccount(context.auth.account.id);
  },
};

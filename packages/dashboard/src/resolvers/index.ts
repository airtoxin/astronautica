import { Resolvers } from "../graphql-types.gen";
import { Account } from "./Account";
import { Organization } from "./Organization";
import { Query } from "./Query";

export const resolvers: Resolvers = {
  Account,
  Organization,
  Query,
};

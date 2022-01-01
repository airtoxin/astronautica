import { Resolvers } from "../graphql-types.gen";
import { Account } from "./Account";
import { Organization } from "./Organization";
import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Project } from "./Project";
import { TestFile } from "./TestFile";

export const resolvers: Resolvers = {
  Account,
  Organization,
  Project,
  TestFile,
  Query,
  Mutation,
};

import { Resolvers } from "../graphql-types.gen";
import { Account } from "./Account";
import { Organization } from "./Organization";
import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Project } from "./Project";
import { TestFile } from "./TestFile";
import { TestRequest } from "./TestRequest";
import { RequestData } from "./RequestData";
import { PreRequestData } from "./PreRequestData";
import { ResponseData } from "./ResponseData";

export const resolvers: Resolvers = {
  Account,
  Organization,
  Project,
  TestFile,
  TestRequest,
  PreRequestData,
  RequestData,
  ResponseData,
  Query,
  Mutation,
};

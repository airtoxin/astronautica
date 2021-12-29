import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../schema";
import { dataSources } from "../../datasources";
import { context } from "../../context";
import { resolvers } from "../../resolvers";
import { MicroRequest } from "apollo-server-micro/src/types";
import { ServerResponse } from "http";

const server = new ApolloServer({
  typeDefs,
  dataSources,
  context,
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const started = server.start();
export default async (req: MicroRequest, res: ServerResponse) =>
  started.then(() => server.createHandler({ path: "/api/graphql" })(req, res));

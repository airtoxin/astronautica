import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { NEXT_PUBLIC_SERVING_URL } from "./constants";

function createApolloClient() {
  const isSsr = typeof window === "undefined";
  return new ApolloClient({
    connectToDevTools: !isSsr,
    ssrMode: isSsr,
    link: ApolloLink.from([
      new HttpLink({
        uri: `${NEXT_PUBLIC_SERVING_URL}/api/graphql`,
        credentials: "same-origin",
      }),
    ]),
    cache: new InMemoryCache(),
  });
}

let apolloClient: ApolloClient<any>;

export function initializeApolloClient(initialState = {}) {
  const client = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = client.extract();
    client.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === "undefined") return client;

  if (!apolloClient) apolloClient = client;
  return client;
}

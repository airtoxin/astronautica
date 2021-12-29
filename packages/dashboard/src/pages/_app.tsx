import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { initializeApolloClient } from "../apollo";
import { WithLogin } from "../components/WithLogin";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useMemo(
    () => initializeApolloClient(pageProps.initialApolloState),
    [pageProps.initialApolloState]
  );
  return (
    <ApolloProvider client={apolloClient}>
      <WithLogin>
        <Component {...pageProps} />
      </WithLogin>
    </ApolloProvider>
  );
}

export default MyApp;

import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { initializeApolloClient } from "../apollo";
import { WithLogin } from "../components/WithLogin";
import { AppLayout } from "../components/AppLayout";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useMemo(
    () => initializeApolloClient(pageProps.initialApolloState),
    [pageProps.initialApolloState]
  );
  return (
    <RecoilRoot>
      <ApolloProvider client={apolloClient}>
        <WithLogin>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </WithLogin>
      </ApolloProvider>
    </RecoilRoot>
  );
}

export default MyApp;

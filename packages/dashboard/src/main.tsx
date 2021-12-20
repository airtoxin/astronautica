import { createElement, StrictMode, useMemo } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";
import { GoogleLogin } from "react-google-login";
import { getFetch } from "@trpc/client";

const createTrpcClient = (headers: Record<string, string>) =>
  trpc.createClient({
    url: "http://localhost:8080/trpc",
    fetch: (url, options) =>
      getFetch()(url, {
        ...options,
        mode: "cors",
        credentials: "include",
        headers,
      }),
  });

ReactDOM.render(
  createElement(() => {
    const queryClient = useMemo(() => new QueryClient(), []);
    const trpcClient = useMemo(() => createTrpcClient({}), []);

    return (
      <StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}
              onSuccess={async () => {
                const idToken = window.gapi.auth2
                  .getAuthInstance()
                  .currentUser.get()
                  .getAuthResponse().id_token;
                await createTrpcClient({ "Id-Token": idToken }).mutation(
                  "auth.login"
                );
              }}
            />
          </QueryClientProvider>
        </trpc.Provider>
      </StrictMode>
    );
  }),
  document.getElementById("root")
);

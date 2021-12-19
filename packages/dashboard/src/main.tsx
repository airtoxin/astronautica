import { createElement, StrictMode, useMemo } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";
import { GoogleLogin } from "react-google-login";
import { AuthToken } from "./state";
import { useRecoilState } from "recoil";

ReactDOM.render(
  createElement(() => {
    const [apiKey, setApiKey] = useRecoilState(AuthToken);
    const queryClient = useMemo(() => new QueryClient(), []);
    const trpcClient = useMemo(
      () =>
        trpc.createClient({
          url: "http://localhost:8080/trpc",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      [apiKey]
    );

    return (
      <StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}
              onSuccess={() => {
                const token = window.gapi.auth2
                  .getAuthInstance()
                  .currentUser.get()
                  .getAuthResponse().id_token;
                setApiKey(token);
              }}
            />
          </QueryClientProvider>
        </trpc.Provider>
      </StrictMode>
    );
  }),
  document.getElementById("root")
);

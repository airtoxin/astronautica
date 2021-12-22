import "tailwindcss/tailwind.css";
import { createElement, StrictMode, useMemo } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { createTrpcClient, trpc } from "./trpc";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/Routes";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  createElement(() => {
    const queryClient = useMemo(() => new QueryClient(), []);
    const trpcClient = useMemo(() => createTrpcClient({}), []);

    return (
      <StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RecoilRoot>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </RecoilRoot>
            <ReactQueryDevtools position="bottom-right" />
          </QueryClientProvider>
        </trpc.Provider>
      </StrictMode>
    );
  }),
  document.getElementById("root")
);

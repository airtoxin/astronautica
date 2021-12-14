import { StrictMode, createElement, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

ReactDOM.render(
  createElement(() => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
      trpc.createClient({
        url: "http://localhost:8080/trpc",
      })
    );
    return (
      <StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </trpc.Provider>
      </StrictMode>
    );
  }),
  document.getElementById("root")
);

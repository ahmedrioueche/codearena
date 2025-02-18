import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { router } from "./routers/index.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContextProvider>
          <RouterProvider router={router} />
        </AppContextProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { router } from "./routers/index.ts";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

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
      <Toaster position={"top-right"} />
      <Provider store={store}>
        <AppContextProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AppContextProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);

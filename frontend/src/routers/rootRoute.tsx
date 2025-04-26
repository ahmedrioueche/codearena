import { createRootRoute } from "@tanstack/react-router";
import App from "../App";
import NotFoundPage from "../components/NotFound";

export const RootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <NotFoundPage />,
});

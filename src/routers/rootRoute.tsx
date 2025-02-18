import { createRootRoute } from "@tanstack/react-router";
import App from "../App";

export const RootRoute = createRootRoute({
  component: () => <App />,
});

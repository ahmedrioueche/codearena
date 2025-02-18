import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../rootRoute";
import MainPage from "../../app/pages/main/MainPage";

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: () => <MainPage />,
});

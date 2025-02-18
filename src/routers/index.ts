import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { RootRoute } from "./rootRoute";
import { MainRootTree } from "./main";
import { GameRootTree } from "./game";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRootTree,
  GameRootTree,
]);

export const router = new Router({ routeTree });

import { QueryClient } from "@tanstack/react-query";
import App from "./app";
import Home, { loader as homeLoader } from "./pages/home";
import LoginPage from "./pages/login";
import { RouteObject } from "react-router";
import { AuthLayout } from "./layout/auth/auth-layout";
import { HomeLayout } from "./layout/home/home-layout";

const routes: (qc: QueryClient) => RouteObject[] = (qc: QueryClient) => [
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "home",
        Component: HomeLayout,
        children: [
          {
            loader: homeLoader(qc),
            path: "",
            Component: Home,
          },
        ],
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
    ],
  },
];

export { routes };

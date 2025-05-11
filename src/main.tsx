import "./styles/index.css";

import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ConfettiContext } from "./modules/confetti";
import { createBrowserRouter, Link, RouterProvider } from "react-router";
import BaseLayout from "./layout.tsx";
import { ApiProvider } from "./auth/main.tsx";

const App = lazy(() => import("./App.tsx"));
const Wiki = lazy(() => import("./Wiki.tsx"));
const Linktree = lazy(() => import("./Linktree.tsx"));
const AccountManager = lazy(() => import("./account/main.tsx"));
const SignUp = lazy(() => import("./account/signup.tsx"));

const cache = createCache({ key: "mairech-cc" });

const router = createBrowserRouter([
  {
    path: "/",
    Component: BaseLayout,
    errorElement: <div>Oups ! Une erreur est survenue sur la page.</div>,
    children: [
      {
        Component: App,
        index: true,
      },
      {
        path: "/wiki/:page?",
        Component: Wiki,
      },
      {
        path: "/@/:page",
        Component: Linktree,
      },
      {
        path: "/account",
        Component: AccountManager,
      },
      {
        path: "/account/signup/:state",
        Component: SignUp,
      },
    ]
  },
  {
    path: "*",
    Component: () => <div>Oups ! Cette page n'existe pas. <Link to="/">Retour</Link></div>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <ApiProvider interval={30}>
        <ConfettiContext>
          <RouterProvider router={router} />
        </ConfettiContext>
      </ApiProvider>
    </CacheProvider>
  </StrictMode>,
);

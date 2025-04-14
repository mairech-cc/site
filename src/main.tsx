import "./styles/index.css";

import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ConfettiContext } from "./modules/confetti";
import { createBrowserRouter, Link, RouterProvider } from "react-router";
import BaseLayout from "./layout.tsx";

const App = lazy(() => import("./App.tsx"));
const Wiki = lazy(() => import("./Wiki.tsx"));

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
      <ConfettiContext>
        <RouterProvider router={router} />
      </ConfettiContext>
    </CacheProvider>
  </StrictMode>,
);

import "./styles/index.css";

import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ConfettiContext } from "./modules/confetti";
import { BrowserRouter, Route, Routes } from "react-router";
import { ScrollToTop } from "./modules/scroll/scroll-to-top";

const App = lazy(() => import("./App.tsx"));
const Wiki = lazy(() => import("./Wiki.tsx"));

const cache = createCache({ key: "mairech-cc" });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <ConfettiContext>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route index element={<App />} />

            <Route path="/wiki/:page?" element={<Wiki />} />
          </Routes>
        </BrowserRouter>
      </ConfettiContext>
    </CacheProvider>
  </StrictMode>,
);

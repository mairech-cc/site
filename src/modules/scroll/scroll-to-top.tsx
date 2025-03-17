import { useEffect } from "react";
import { useLocation } from "react-router";
import { getMainScrollElement } from "./ctx";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const element = getMainScrollElement() ?? window;
    element.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

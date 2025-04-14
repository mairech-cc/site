import { useEffect, useState } from "react";

export function isDescendentOf(element: HTMLElement | SVGElement, main: HTMLElement | SVGElement): boolean {
  if (element === main) {
    return true;
  }

  let current: HTMLElement | SVGElement | null = element;

  while (current && current !== document.body && current !== document.documentElement) {
    if (current === main) {
      return true;
    }
    
    current = (current instanceof HTMLElement) ? current.parentElement : current.parentNode as (HTMLElement | SVGElement | null);
  }

  return false;
}

export function useDocumentTitle() {
  const [title, setTitle] = useState(document.title);

  useEffect(() => {
    if (title != document.title) {
      document.title = title;
    }
  }, [title]);

  return [title, setTitle] as const;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

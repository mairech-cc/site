import { useEffect } from "react";

let mainScrollElement: HTMLElement | null = null;

export function useSetMainScrollElement() {
  useEffect(() => {
    return () => {
      if (mainScrollElement) {
        mainScrollElement = null;
      }
    };
  }, []);

  return (element: HTMLElement | null) => {
    mainScrollElement = element;
  }
}

export function getMainScrollElement() {
  return mainScrollElement;
}

import Confetti from "js-confetti";
import { createContext, createElement, PropsWithChildren, useContext } from "react";

let confettiCache: Confetti | undefined = undefined;

export function createConfetti() {
  return confettiCache = (confettiCache ? (() => confettiCache) : (() => new Confetti))()!;
}

export const ConfettiCtx = createContext<Confetti>(undefined!);

export function ConfettiContext({ children }: PropsWithChildren<object>) {
  return (
    createElement(ConfettiCtx.Provider, { value: createConfetti(), children })
  );
}

export function useConfetti() {
  return useContext(ConfettiCtx);
}

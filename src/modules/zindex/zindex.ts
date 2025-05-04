import { createContext, useContext, useRef, useEffect, ReactNode, createElement, useMemo } from "react";
import { PoolManager } from "./pool";

const ZIndexContext = createContext<PoolManager | null>(null);

/**
 * Makes a `z-index` pool.
 * 
 * Note: You cannot change bounds.
 */
export const ZIndexProvider = ({ min, max, children }: { min: number; max: number; children: ReactNode }) => {
  const poolRef = useMemo(() => new PoolManager(min, max), [min, max]);

  return createElement(ZIndexContext.Provider, { value: poolRef }, children);
};

export const useAllocateZIndex = (count = 1): number | null => {
  const pool = useContext(ZIndexContext);

  if (!pool) {
    throw new Error("useAllocateZIndex must be used within a <ZIndexProvider>");
  }

  const allocationRef = useRef<number | null>(null);

  if (allocationRef.current == null) {
    allocationRef.current = pool.allocate(count);
  }

  useEffect(() => {
    const index = allocationRef.current;

    return () => {
      if (index != null) {
        pool.freeRegion(index, count);
      }
    };
  }, [pool, count]);

  return allocationRef.current;
};

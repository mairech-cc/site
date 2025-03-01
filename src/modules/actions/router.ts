import { useCallback, useMemo } from "react";

export function useActionsRouter(factory: () => Record<string, (...args: unknown[]) => void>) {
  const handlers = useMemo(factory, [factory]);

  const router = useCallback(([action, ...args]: [string, ...unknown[]]) => {
    if (action in handlers) {
      handlers[action](...args);
    } else {
      console.error(`unroutable action: ${action}`);
    }
  }, [handlers]);

  return router;
}

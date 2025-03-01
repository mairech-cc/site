import { createContext, useContext } from "react";
import { Action } from "./list";

export interface ActionContext {
  /**
   * Registers an action handler. Returning a callback removing the handler.
   */
  handleAction(handler: (action: Action) => void): () => void;
  /**
   * Forces trigger an action. This only calls handlers, not on original `<ActionsHandler />`.
   */
  triggerAction(action: Action): void;
}

export const ActionsCtx = createContext<ActionContext | null>(null);

export function useActions() {
  return useContext(ActionsCtx)!;
}

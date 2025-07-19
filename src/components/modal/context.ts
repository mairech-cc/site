import { createContext, use } from "react";
import { create } from "zustand/react";
import { immer } from "zustand/middleware/immer";

export const ModalBlurContext = createContext(false);

interface ShownModalStore {
  shownModals: string[];
  nextId: number;

  add(id: string): void;
  remove(id: string): void;
  getNewId(): number;
}

export const useShownModals = create<ShownModalStore>()(immer((set, get) => ({
  shownModals: [],
  nextId: 0,

  add: id => set(prev => {
    prev.shownModals.push(id);
  }),
  remove: id => set(prev => {
    prev.shownModals = prev.shownModals.filter(x => x != id)
  }),
  getNewId: () => (set(prev => {
    prev.nextId++
  }), get().nextId - 1),
})));

/**
 * This hook should be used on overlay elements in modals. Overlay elements in modals should be blury when a modal
 * is shown over.
 * 
 * Note: This doesn't work on components outside Modals, like overlay on body, use {@link useModalShown} instead.
 * 
 * @returns `true` a modal is shown over the parent, `false` else.
 */
export function useModalBlur() {
  return use(ModalBlurContext);
}

/**
 * This hook should be used on scrollable containers, like body. Body should not be scrollable when a modal is shown.
 * 
 * @returns `true` when at least one modal is shown, `false` else.
 */
export function useModalShown() {
  return useShownModals(v => v.shownModals).length >= 1;
}

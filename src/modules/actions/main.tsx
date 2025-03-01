import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Action, ACTIONS } from "./list";
import { ActionContext, ActionsCtx } from "./context";
import { isDescendentOf } from "../../utils/dom";
import { zaraz } from "zaraz-ts";
import { isMacOS } from "../../utils/macos";

export type Key = `Arrow${"Up" | "Down" | "Left" | "Right"}` | " " | `${"Shift+" | "Ctrl+" | ""}${"a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" |
  "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"}`;

export interface ClickElements {
  title: HTMLHeadingElement;
  firstnames: HTMLSpanElement;
  help: HTMLSpanElement;
  search: HTMLSpanElement;
}

export type ClickElementsTypes = ClickElements[keyof ClickElements];
export type ClickElementsRef = { [K in keyof ClickElements]: (element: ClickElements[K]) => void; };
export type ClickElementsList = { [K in keyof ClickElements]: (ClickElements[K] | null)[]; };

export function ActionsHandler({ children, handler }: {
  children: (refs: ClickElementsRef) => ReactNode;
  handler: (action: [string, ...unknown[]]) => void;
}) {
  const actionsCtx: ActionContext = useMemo(() => {
    const handlers: (((action: Action) => void) | null)[] = [];

    return {
      handleAction(handler) {
        const n = handlers.push(handler) - 1;

        return () => handlers[n] = null;
      },
      triggerAction(action) {
        for (const handler of handlers) {
          if (handler == null) {
            continue;
          }

          handler(action);
        }
      },
    };
  }, []);
  const elements = useRef<Partial<ClickElementsList>>();
  const keyStep = useRef<[string[], number]>();

  const createRegistry = useCallback(<K extends keyof ClickElements>(name: K) => {
    return (element: ClickElements[K]) => {
      let e = elements.current;

      if (e == undefined) {
        elements.current = (e = {});
      }

      if (!Array.isArray(e[name])) {
        e[name] = [];
      }

      if (!e[name].includes(element)) {
        e[name].push(element);
      }
    };
  }, [elements]);

  const registries: ClickElementsRef = useMemo(() => ({
    title: createRegistry("title"),
    firstnames: createRegistry("firstnames"),
    help: createRegistry("help"),
    search: createRegistry("search"),
  }), [createRegistry]);

  useEffect(() => {
    if (!keyStep.current) {
      keyStep.current = [[], 0];
    }

    const unregister = actionsCtx.handleAction(action => {
      if ("noAction" in action) {
        return;
      }

      handler(action.action);
    });

    function onBodyClick(ev: MouseEvent) {
      if (!ev.target || !(ev.target instanceof HTMLElement) && !(ev.target instanceof SVGElement)) {
        return;
      }

      main: for (const [name, action] of Object.entries(ACTIONS)) {
        if (action.type != "click" || "noAction" in action) {
          continue;
        }

        for (const e of elements.current![action.element] ?? []) {
          if (e && isDescendentOf(ev.target, e)) {
            actionsCtx.triggerAction(action);
            zaraz.track("click-trigger", { name });
            break main;
          }
        }
      }
    }

    function onKeyPress(ev: KeyboardEvent) {
      const [actions, step] = keyStep.current!;

      // We are ignoring specials keys
      if ([
        "Unidentified", // Unknown key, should never be treated
        "CapsLock",
        "Shift",
        "Control", // Control on Macs, Ctrl on Windows/Linux
        "Meta", // Command on Macs, Windows on Windows, Meta on Linux
        "Alt", // Option on Macs, Alt on Windows/Linux
        "AltGraph", // Only on Windows/Linux as AltGr
        "Fn",
        "FnLock",
        "NumLock",
        "ScrollLock"
      ].includes(ev.key)) {
        return;
      }

      if (step > 0) {
        const found: string[] = [];

        for (const action of actions) {
          const realAction = ACTIONS[action];

          if (realAction.type != "keys") {
            continue;
          }

          let key = realAction.keys[step];

          if (key.startsWith("Shift+")) {
            key = key.substring(6) as Key;

            if (!ev.shiftKey) {
              continue;
            }
          } else if (ev.shiftKey) {
            continue;
          }

          if (key.startsWith("Ctrl+")) {
            key = key.substring(5) as Key;

            if (!(isMacOS() ? ev.metaKey : ev.ctrlKey)) {
              continue;
            }
          } else if (isMacOS() ? ev.metaKey : ev.ctrlKey) {
            continue;
          }

          if (key.startsWith("Alt+")) {
            key = key.substring(4) as Key;

            if (!ev.altKey) {
              continue;
            }
          } else if (ev.altKey) {
            continue;
          }

          if (key.toLowerCase() == ev.key.toLowerCase()) {
            keyStep.current![1] = step + 1;
            found.push(action);
          }
        }

        if (found.length == 0) {
          // Resetting key step because of mistake.
          keyStep.current = [[], 0];
          return;
        } else {
          keyStep.current = [found, step + 1];
        }
      } else {
        const found: string[] = [];

        for (const [name, realAction] of Object.entries(ACTIONS)) {
          if (realAction.type != "keys" || "noAction" in realAction) {
            continue;
          }

          let key = realAction.keys[0];

          if (key.startsWith("Shift+")) {
            key = key.substring(6) as Key;
            
            if (!ev.shiftKey) {
              continue;
            }
          } else if (ev.shiftKey) {
            continue;
          }

          if (key.startsWith("Ctrl+")) {
            key = key.substring(5) as Key;
            
            if (!(isMacOS() ? ev.metaKey : ev.ctrlKey)) {
              continue;
            }
          } else if (isMacOS() ? ev.metaKey : ev.ctrlKey) {
            continue;
          }

          if (key.startsWith("Alt+")) {
            key = key.substring(4) as Key;
            
            if (!ev.altKey) {
              continue;
            }
          } else if (ev.altKey) {
            continue;
          }

          if (key.toLowerCase() == ev.key.toLowerCase()) {
            found.push(name);
          }
        }

        if (found.length == 0) {
          return;
        }

        keyStep.current = [found, 1];
      }

      const [newActions, newStep] = keyStep.current;

      // No actions started
      if (newStep == 0) {
        return;
      }

      const found: [string, Action][] = [];

      for (const [name, action] of Object.entries(ACTIONS)) {
        if (action.type != "keys" || "noAction" in action) {
          continue;
        }

        if (newActions.includes(name) && action.keys.length == newStep) {
          found.push([name, action]);
          continue;
        }
      }

      // Conflict between keybinds.
      if (found.length >= 2) {
        alert(`ALERT conflicts on ${found.map(n => n[0]).join()} at step ${newStep} (after).`);
        // Resetting key step because of error.
        keyStep.current = [[], 0];
        return;
      }

      if (found.length == 1) {
        const a = found[0][1];

        if ("noAction" in a) {
          return alert("undefined behavior");
        }

        actionsCtx.triggerAction(a);
        // Resetting key step because of end of sequence.
        keyStep.current = [[], 0];
        zaraz.track("keybind-trigger", { name: found[0][0] });
        // Prevents the default browser/OS behavior.
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    }

    document.body.addEventListener("click", onBodyClick);
    document.body.addEventListener("keydown", onKeyPress);

    return () => {
      unregister();
      document.body.removeEventListener("click", onBodyClick);
      document.body.removeEventListener("keydown", onKeyPress);
    }
  }, [handler, actionsCtx]);

  const child = useMemo(() => children(registries), [children, registries]);

  return <ActionsCtx.Provider value={actionsCtx}>{child}</ActionsCtx.Provider>;
}

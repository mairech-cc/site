import { Fragment } from "react/jsx-runtime";
import { Action, ACTIONS } from "../actions/list";
import { Keys } from "./keys";
import { ClickElement } from "./click";
import { useCallback, useEffect, useRef } from "react";
import { useActions } from "../actions/context";
import { css } from "@emotion/react";

const TRIGGER_ANIMATION: Keyframe[] = [
  { transform: "rotateX(0deg)", },
  { transform: "rotateX(360deg)", },
];

const styles = {
  menu: css({
    display: "grid",
    placeItems: "center",
    position: "fixed",
    inset: 0,
    padding: "1em",
    background: "#0000003a",
    zIndex: 2000,
  }),
  innerMenu: css({
    display: "grid",
    gridTemplateColumns: "20em 1fr 10em",
    padding: "1em",
    background: "#3b3b3b",
    color: "white",
    boxShadow: "0 0 20em black",
    width: "calc(90% - 2em)",
    height: "calc(90% - 2em)",
    overflow: "auto",
  }),
  header: css({
    textAlign: "start",
    borderBottom: "1px solid white",
    fontWeight: "bolder",
    padding: ".5em 1em",

    "&:not(:first-child)": {
      borderLeft: "1px solid white",
    }
  }),
  fullRow: css({
    textAlign: "start",
    gridColumn: "1 / span 3",
    padding: ".5em",
    fontWeight: "bolder",
    fontSize: "1.5em",
    borderBottom: "1px solid white",
  }),
  cell: css({
    padding: "1em",
    textAlign: "start",

    "&:not(:nth-last-child(-n + 3))": {
      borderBottom: "1px solid white",
    },

    "&:not(.first)": {
      borderLeft: "1px solid white",
    },

    "&.first>span": {
      display: "block",
      cursor: "pointer",
    }
  }),
}

export function Help() {
  const actionsCtx = useActions();
  const spans = useRef<Record<string, HTMLSpanElement>>();

  const registerSpan = useCallback((action: Action, span: HTMLSpanElement) => {
    if (!spans.current) {
      spans.current = {};
    }

    spans.current[action.description] = span;

    if (!span || span.dataset.handled == "true") {
      return;
    }

    span.dataset.handled = "true";

    function onClick() {
      actionsCtx.triggerAction(action);
    }

    span.addEventListener("click", onClick);
  }, [spans, actionsCtx]);

  const actions = Object.values(ACTIONS);

  useEffect(() => {
    const unregister = actionsCtx.handleAction(action => {
      const key = action.description;
      const realSpans = spans.current!;

      if (!realSpans) {
        return;
      }

      if (key in realSpans) {
        const span = realSpans[key];

        span.animate(TRIGGER_ANIMATION, { duration: 400, });
      }
    });

    return () => unregister();
  }, [actionsCtx]);

  return (
    <>
      <div css={styles.menu}>
        <div css={styles.innerMenu}>
          <span css={styles.header}>Activition</span>
          <span css={styles.header}>Description</span>
          <span css={styles.header}>De</span>

          <span css={styles.fullRow}>
            Cliques/appuies
          </span>

          {actions.filter(a => a.type == "click").map(a => (
            <Fragment key={a.description}>
              <span css={styles.cell} className="first">
                <span ref={registerSpan.bind(null, a)}>
                  <ClickElement>{a.element}</ClickElement>
                </span>
              </span>
              <span css={styles.cell}>{a.description}</span>
              <span css={styles.cell}>{a.authors.join(", ")}</span>
            </Fragment>
          ))}

          <span css={styles.fullRow}>
            Raccourcis clavier
          </span>

          {actions.filter(a => a.type == "keys").map(a => (
            <Fragment key={a.description}>
              <span css={styles.cell} className="first">
                <span ref={registerSpan.bind(null, a)}>
                  <Keys>{a.keys}</Keys>
                </span>
              </span>
              <span css={styles.cell}>{a.description}</span>
              <span css={styles.cell}>{a.authors.join(", ")}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )

}

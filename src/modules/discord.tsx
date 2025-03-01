import { css } from "@emotion/react";
import { useActions } from "./actions/context";
import { ACTIONS } from "./actions/list";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: ".5em",
    padding: "1em",
    background: "#3b3b3b",
    color: "white",
    boxShadow: "0 0 20em black",
    width: "calc(90% - 2em)",
    height: "calc(90% - 2em)",
    overflow: "auto",

    "&>h2": {
      fontFamily: "Roboto",
    }
  }),
};

export function Discord() {
  const actions = useActions();

  return (
    <div css={styles.menu}>
      <div css={styles.innerMenu}>
        <h1>
          Améliorez <code>mairech.cc</code> !
        </h1>

        <p>
          Rejoignez le serveur Discord pour améliorer <code>mairech.cc</code>.
        </p>

        <h2>
          <a href="https://mairech.cc/discord" target="_blank">Rejoindre...</a>
        </h2>

        <span>
          <a href="#" onClick={e => {
            e.preventDefault();
            actions.triggerAction(ACTIONS.discord);
          }}>
            Fermer
          </a>
        </span>
      </div>
    </div>
  )
}

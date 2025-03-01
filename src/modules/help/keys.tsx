import { memo, ReactNode } from "react";
import { Key } from "../actions/main";
import { Interpolation, Theme } from "@emotion/react";
import { isMacOS } from "../../utils/macos";

const styles = {
  key: {
    backgroundColor: "#eee",
    borderRadius: "3px",
    border: "1px solid #b4b4b4",
    boxShadow: "0 2px 0 0 #ffffffb3 inset",
    color: "#333",
    display: "inline-block",
    fontSize: "0.85em",
    fontWeight: "700",
    lineHeight: "1",
    padding: "2px 3px",
    margin: "0 2px",
    whiteSpace: "nowrap",
  } satisfies Interpolation<Theme>,
}

export const Keys = memo(({ children }: { children: Key[]; }) => {
  const elements: ReactNode[] = [];
  let i = 0;

  for (let key of children) {
    beforeComma: {
      if (key.startsWith("Arrow")) {
        if (key == "ArrowUp") {
          elements.push(
            <span key={i++} css={styles.key}>↑</span>
          );
        }

        if (key == "ArrowRight") {
          elements.push(
            <span key={i++} css={styles.key}>→</span>
          );
        }

        if (key == "ArrowDown") {
          elements.push(
            <span key={i++} css={styles.key}>↓</span>
          );
        }

        if (key == "ArrowLeft") {
          elements.push(
            <span key={i++} css={styles.key}>←</span>
          );
        }

        break beforeComma;
      }

      if (key.startsWith("Ctrl+")) {
        key = key.substring(5) as Key;

        elements.push(
          isMacOS() ? <span key={i++} css={styles.key}>Cmd</span> : <span key={i++} css={styles.key}>Ctrl</span>
        );
      }

      if (key.startsWith("Alt+")) {
        key = key.substring(4) as Key;

        elements.push(
          isMacOS() ? <span key={i++} css={styles.key}>Option</span> : <span key={i++} css={styles.key}>Alt</span>
        );
      }

      if (key.startsWith("Shift+")) {
        key = key.substring(6) as Key;

        elements.push(
          <span key={i++} css={styles.key}>⇧</span>,
          <span key={i++} css={styles.key}>{key.toUpperCase()}</span>,
          ` (${key.toUpperCase()} majuscule)`
        );

        break beforeComma;
      }

      elements.push(
        <span key={i++} css={styles.key}>{key.toUpperCase()}</span>,
        ` (${key.toUpperCase()} minuscule)`
      );
    };

    elements.push(", ");
  }

  elements.pop();

  return elements;
});

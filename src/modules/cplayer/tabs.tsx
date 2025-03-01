import { IconInfoHexagonFilled, IconLoader2, IconPlayerPlayFilled, IconTrash } from "@tabler/icons-react";
import { ActionButton, Tooltip } from "../button";
import { githubDark } from "./utils";
import { FileIcon } from "./icon";
import { keyframes } from "@emotion/react";
import { Dispatch, SetStateAction, useRef } from "react";

const rotation = keyframes({
  from: {
    transform: "rotate(0)",
  },
  to: {
    transform: "rotate(1turn)",
  }
});

export function Tabs({ currentTab, changeTab, working, start, setFiles, children }: {
  currentTab: string;
  changeTab: (tab: string) => void;
  working: boolean;
  start: () => void;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  children: string[];
}) {
  const colors = githubDark.colors!;

  return (
    <div
      css={{
        display: "flex",
        borderRadius: "10px 10px 0 0",
        borderBottom: `1px solid #ffffff11`,
        background: colors["tab.inactiveBackground"],
        height: "100%"
      }}
    >
      <div
        css={{
          display: "flex",
          height: "100%",
          alignContent: "center",
          fontSize: "1.3em",
          width: "100%",
          overflow: "scroll",
          borderRadius: "10px 0 0 0",
        }}
      >
        <span css={{
          display: "inline-grid",
          placeItems: "center",
          height: "100%",
          gridTemplateColumns: "1fr",
          gap: "5px",
          cursor: "pointer",
          minWidth: "2em",
          padding: ".4em",
          color: currentTab == "@@NEW@@" ? colors["tab.activeForeground"] : colors["tab.inactiveForeground"],
          background: currentTab == "@@NEW@@" ? colors["tab.activeBackground"] : colors["tab.inactiveBackground"],
          borderColor: colors["tab.border"],
          borderWidth: "1px",
          borderStyle: "none solid none none",

          "&:hover": {
            background: colors["tab.hoverBackground"],
          },

          // "&>:not(span)": {
          //   fontSize: "12px",
          // }
        }} onClick={() => changeTab("@@NEW@@")}>
          <span css={{ width: "max-content" }}>+</span>
        </span>

        {children.map(x => (
          <Tab
            key={x}
            tab={x}
            first={false}
            delete={() => (
              setFiles(f => (delete f[x], { ...f })),
              changeTab("@@NEW@@")
            )}
            {...{ currentTab, changeTab }}
          />
        ))}
      </div>

      <div css={{
        display: "flex",
        flexDirection: "row",
      }}>
        <Tooltip tooltip={working ? "En cours..." : "Exécuter"}>
          <ActionButton theme="dark" onClick={start}>
            {working ? (
              <IconLoader2 color="#e1e4e8" css={{
                animation: `${rotation} 1s linear infinite`
              }} />
            ) : (
              <IconPlayerPlayFilled color="#e1e4e8" />
            )}
          </ActionButton>
        </Tooltip>

        <Tooltip
          tooltip={
            <>
              Fonctionne avec Shiki, @wasmer/sdk,<br />
              clang et @xterm/xterm.
            </>
          }
        >
          <ActionButton theme="dark">
            <IconInfoHexagonFilled color="#e1e4e877" />
          </ActionButton>
        </Tooltip>
      </div>
    </div>
  );
}

export function Tab({ tab, currentTab, changeTab, delete: deleteFile, first }: {
  tab: string;
  currentTab: string;
  changeTab: (tab: string) => void;
  delete: () => void;
  first: boolean;
}) {
  const colors = githubDark.colors!;

  const spanRef = useRef<HTMLSpanElement | null>(null);

  return (
    <span
      ref={spanRef}
      data-builtin="true"
      css={{
        display: "inline-grid",
        alignItems: "center",
        height: "100%",
        gridTemplateColumns: "max-content 1fr max-content",
        gap: "5px",
        cursor: "pointer",
        minWidth: "7em",
        padding: "0 .4em",
        color: tab == currentTab ? colors["tab.activeForeground"] : colors["tab.inactiveForeground"],
        background: tab == currentTab ? colors["tab.activeBackground"] : colors["tab.inactiveBackground"],
        borderColor: colors["tab.border"],
        borderWidth: "1px",
        borderStyle: first ? "none solid none none" : "none solid none solid",

        "&:hover": {
          background: colors["tab.hoverBackground"],
        },

        "&>:not(span)": {
          fontSize: "12px",
        }
      }}
      onClick={() => changeTab(tab)}
    >
      <FileIcon name={tab} />
      <span data-builtin="true" css={{ lineHeight: 1, height: "1em" }}>{tab}</span>

      <Tooltip tooltip="Supprimer le fichier">
        <ActionButton
          theme="dark"
          onClick={async e => {
            e.stopPropagation();
            deleteFile();
          }}
        >
          <IconTrash size={14} color="#e1e4e8" />
        </ActionButton>
      </Tooltip>
    </span>
  );
}

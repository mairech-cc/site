import "@xterm/xterm/css/xterm.css";

import { lazy, useCallback, useId, useMemo, useRef, useState } from "react";
import { githubDark, shiki } from "./utils";
import { Tabs } from "./tabs";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../button";
import type { Terminal } from "@xterm/xterm";

const CTerminal = lazy(() => import("./term").then(x => ({ default: x.CPlayTerminal })));

export function CPlayer({ baseFiles }: {
  baseFiles: Record<string, string>;
}) {
  const props = { baseFiles };

  return (
    <ErrorBoundary
      fallback={
        "Impossible de charger le module de code C, on dirait que votre navigateur ne prend pas en charge ce module. " +
        "Essayez sur un autre navigateur."
      }
    >
      <CPlayerImpl {...props} />
    </ErrorBoundary>
  )
}

export function CPlayerImpl({ baseFiles }: {
  baseFiles: Record<string, string>;
}) {
  const colors = githubDark.colors!;

  const [files, setFiles] = useState(baseFiles);
  const [tab, setTab] = useState(Object.keys(files)[0]);
  const [working, setWorking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const newFileNameId = useId();
  const [newFileName, setNewFileName] = useState("");
  const newFileTypeId = useId();
  const [newFileType, setNewFileType] = useState<"c" | "h" | "cpp" | "hpp">("c");

  const newFileIssues = useMemo(() => [
    newFileName.length < 3 ? ["Trop court, minimum 3 charactères"] : [],
    newFileName.length > 20 ? ["Trop long, maximmum 20 charactères"] : [],
    !/^([\w/])+$/i.test(newFileName) ? ["Ne peut uniquement contenir des charactères alphanumériques ou des slashs"] : [],
    newFileName.startsWith("/") ? ["Ne peut pas commencer par un slash"] : []
  ].flat(), [newFileName]);

  const htmlFiles = useMemo(() => {
    const f: Record<string, string> = {};

    for (const key in files) {
      const html = shiki.codeToHtml(files[key], {
        lang: "c",
        theme: "github-dark",
      });

      f[key] = html;
    }

    return f;
  }, [files]);
  const lines = useMemo(() => {
    const f: Record<string, number> = {};

    for (const key in files) {
      f[key] = files[key].split("\n").length;
    }

    return f;
  }, [files]);

  const [terminal, setTerminal] = useState(false);
  const div = useRef<HTMLDivElement | null>(null);

  const terminalRef = useRef<Terminal | null>(null);

  const triggerTerminal = useCallback(async () => {
    if (working) {
      return;
    }

    if (terminal) {
      terminalRef.current?.clear();
      setWorking(true);
      setDownloadUrl("");
      return;
    }

    setWorking(true);

    div.current!.style.width = "40em";
    div.current!.style.padding = ".5em";

    setTimeout(() => {
      setTerminal(true);
    }, 750);
  }, [terminal, working]);

  return (
    <div
      css={{
        position: "relative",
        background: colors["editor.background"],
        color: colors["editor.foreground"],
        fontSize: "12px",
        display: "inline-grid",
        gridAutoColumns: "40em max-content",
        gridAutoRows: "max-content 1fr",
        borderRadius: "10px",
        maxWidth: "80em",
        height: "24.75em",

        "& span:not([data-builtin=true]), & pre": {
          padding: 0,
          margin: 0,
        }
      }}
    >
      <Tabs
        currentTab={tab}
        changeTab={t => setTab(t)}
        working={working}
        start={triggerTerminal}
        setFiles={setFiles}
      >
        {Object.keys(files)}
      </Tabs>

      <div
        css={{
          display: "inline-grid",
          gridTemplateColumns: "3em 1fr",
          width: "100%",
          height: "100%",
          overflow: "scroll",
        }}
      >
        {tab == "@@NEW@@" ? (
          <>
            <div css={{
              gridArea: "1 / 1 / 1 / 3",
              padding: "1em",
              display: "flex",
              flexDirection: "column",
              gap: "1em",

              "&>*": {
                margin: "0",
              },

              "@media (prefers-color-scheme: light)": {
                background: "white",
                color: "black",
                border: `1px solid ${colors["tab.border"]}`,
                borderRadius: "0 0 10px 10px",
              }
            }} onKeyDown={e => e.stopPropagation()}>
              <h2>Créer un fichier</h2>

              <label htmlFor={newFileTypeId}>
                Type de fichier
              </label>

              <select id={newFileTypeId} value={newFileType} onChange={e => setNewFileType(e.currentTarget.value as "c" | "h" | "cpp" | "hpp")}>
                <optgroup label="C">
                  <option value="c">Source C</option>
                  <option value="h">En-tête C</option>
                </optgroup>
                <optgroup label="C++">
                  <option value="cpp">Source C++</option>
                  <option value="hpp">En-tête C++</option>
                </optgroup>
              </select>

              <label htmlFor={newFileNameId}>
                Nom du fichier
              </label>

              <code css={{
                display: "inline-grid",
                gridTemplateColumns: "1fr 4em",
                gap: ".5em",

                "&, &>input": {
                  background: "#555555",

                  "@media (prefers-color-scheme: light)": {
                    background: "#cccccc",
                  }
                },

                "&>*": {
                  padding: ".5em",
                },

                "&>input": {
                  border: "none",
                  outline: "none",
                },

                "&>span": {
                  display: "inline-flex",
                  alignItems: "center",
                }
              }}>
                <input type="text" id={newFileNameId} value={newFileName} onChange={e => setNewFileName(e.currentTarget.value)} />
                <span>
                  .{newFileType}
                </span>
              </code>

              <div css={{
                color: "red",

                "&>*": {
                  margin: "0",
                }
              }}>
                {newFileIssues.map(x => (
                  <p key={x}>
                    {x}
                  </p>
                ))}
              </div>

              <Button
                disabled={newFileIssues.length >= 1}
                onClick={() => {
                  if (newFileIssues.length >= 1) {
                    return;
                  }

                  const key = newFileName + "." + newFileType;
                  setFiles(f => ({ ...f, [key]: "// Nouveau fichier..." }));
                  setTab(key);
                  setNewFileName("");
                  setNewFileType("c");
                }}
              >
                Créer le fichier
              </Button>
            </div>
          </>
        ) : (
          <>
            <div
              css={{
                gridArea: "1 / 1 / 1 / 1",
                display: "inline-flex",
                flexDirection: "column",
                borderRight: "2px solid #ffffff11",
                padding: ".5em",
                textAlign: "end",
                color: "#ffffff66"
              }}
            >
              {Array.from({ length: lines[tab] }).fill("").map((_, i) => (
                <code key={i}>{i + 1}</code>
              ))}
            </div>

            <span
              data-builtin="true"
              css={{
                gridArea: "1 / 2 / 1 / 2",
                padding: ".5em",
                overflow: "scroll",
                display: "inline-block",
                width: "max-content",

                "&>*": {
                  width: "max-content",
                }
              }}
              dangerouslySetInnerHTML={{ __html: htmlFiles[tab] }}
            />

            <textarea
              css={{
                gridArea: "1 / 2 / 1 / 2",
                fontSize: "12px",
                color: "transparent",
                background: "transparent",
                padding: ".5em",
                display: "block",
                resize: "none",
                border: "none",
                width: "calc(100% - 1em)",
                height: "calc(100% - 1em)",
                outline: "none",
                fontFamily: '"Space Mono", monospace',
                whiteSpace: "pre",
                caretShape: "bar",
                caretColor: "rgb(156 163 175 / 1)"
              }}
              spellCheck={false}
              value={files[tab]}
              onInput={e => setFiles(x => ({ ...x, [tab]: (e.target as HTMLTextAreaElement).value }))}
              onKeyDown={e => e.stopPropagation()}
            />
          </>
        )}
      </div>

      <a
        href={downloadUrl}
        download="output.wasm"
        css={{
          pointerEvents: downloadUrl ? "auto" : "none",
          transition: "all .5s",
          opacity: downloadUrl ? 1 : 0,
          gridArea: "2 / 1 / 2 / 1",
          position: "absolute",
          bottom: downloadUrl ? "1em" : "0em",
          right: "1em",
        }}
      >
        <Button>
          Télécharger l'exécutable généré
        </Button>
      </a>

      <div
        ref={div}
        css={{
          gridArea: "1 / 2 / 3 / 2",
          fontFamily: '"JetBrains Mono"',
          transition: "all .5s",
          width: "0px",
          background: "black",
          borderRadius: "0 10px 10px 0",
        }}
        onKeyUp={e => e.stopPropagation()}
      >
        {terminal && <CTerminal
          working={working}
          setWorking={setWorking}
          setDownloadUrl={setDownloadUrl}
          files={files}
          ref={terminalRef}
        />}
      </div>
    </div>
  );
}

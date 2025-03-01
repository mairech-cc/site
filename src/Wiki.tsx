import "katex/dist/katex.min.css";

import confettiMp3 from "./assets/confetti.mp3";

import { Link, useParams } from "react-router";
import { Global } from "@emotion/react";
import { adapters, categories, contents, engines, metadatas, pages } from "./wiki/main";
import { useDocumentTitle } from "./utils/dom";
import { useMemo, useState } from "react";
import { ActionsHandler } from "./modules/actions/main";
import { useActionsRouter } from "./modules/actions/router";
import { useConfetti } from "./modules/confetti";
import { Help } from "./modules/help/main";
import { Discord } from "./modules/discord";
import { IconInfoCircle } from "@tabler/icons-react";

export default function Wiki() {
  const confetti = useConfetti();

  const params = useParams();
  const [title, setTitle] = useDocumentTitle();
  const [help, setHelp] = useState(false);
  const [discord, setDiscord] = useState(false);

  const pageId = params.page ?? "main";
  const tableOfContent = contents[pageId];

  const body = useMemo(() => {
    if (!(pageId in metadatas)) {
      return (
        <>
          <h1>
            Page non trouvée 😔
          </h1>

          <p>
            La page demandée n'existe pas. <Link to="/wiki">Voir la page principale...</Link>
          </p>
        </>
      );
    }

    const pageMetadata = metadatas[pageId];
    const PageBody = pages[pageId];

    if ("title" in pageMetadata && typeof pageMetadata.title == "string" && title != pageMetadata.title) {
      setTitle(pageMetadata.title);
    }

    return (
      <>
        <PageBody />

        <p
          data-native
          css={{
            marginTop: "2em",
            color: "gray",
            textAlign: "end",
            fontSize: ".8em"
          }}
        >
          Cette page utilise {engines[adapters[pageId]]}.
        </p>
      </>
    );
  }, [pageId, title, setTitle]);

  const handler = useActionsRouter(() => ({
    confetti() {
      confetti.addConfetti();
      const audio = new Audio(confettiMp3);
      audio.play();
      audio.addEventListener("ended", () => audio.remove());
    },
    play(file) {
      if (typeof file != "string") {
        return;
      }

      const audio = new Audio(file);
      audio.play();
    },
    playRandom(files) {
      if (!Array.isArray(files) || files.some(x => typeof x != "string")) {
        return;
      }

      this.play(files[Math.floor(Math.random() * files.length)]);
    },
    help() {
      setHelp(v => !v);
      setDiscord(false);
    },
    discord() {
      setHelp(false);
      setDiscord(v => !v);
    }
  }));

  return (
    <ActionsHandler handler={handler}>
      {refs => (
        <>
          {help && <Help />}
          {discord && <Discord />}

          <div
            css={{
              height: "100vh",
              width: "100vw",
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
            }}
          >
            <Global
              styles={{
                "body": {
                  margin: 0,
                }
              }}
            />

            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                width: "20em",
                background: "#00000022",
                borderRight: "1px solid #767676",
                padding: "1em",

                "@media (prefers-color-scheme: dark)": {
                  background: "#ffffff22",
                }
              }}
            >
              <span css={{
                display: "inline-flex",
                justifyContent: "space-between",
              }}>
                <Link to="/">
                  ← Revenir à l'accueil
                </Link>

                <span
                  ref={refs.help}
                  css={{ cursor: "pointer" }}
                >
                  <IconInfoCircle />
                </span>
              </span>

              <h1 css={{ margin: 0, fontSize: "2.4em" }}>
                <code ref={refs.title}>
                  Nejib Mairech
                </code>
              </h1>

              <p css={{ margin: 0, fontSize: ".8em" }}>
                Tous les cours pour la 2I2D Sin sont disponibles ici 😮
              </p>

              <nav css={{
                display: "flex",
                flexDirection: "column",
                gap: ".4em",
              }}>
                <h2 css={{ margin: 0, fontSize: "1.4em" }}>
                  Table des matières
                </h2>

                {tableOfContent ? (
                  tableOfContent.map(({ level, content }, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      css={{
                        margin: `0 0 0 ${(Number(level) - 1) * 1}em`,
                      }}
                    >
                      {content}
                    </a>
                  ))
                ) : (
                  <p css={{ margin: 0, fontSize: ".9em", fontStyle: "italic" }}>
                    La table des matières n'est pas disponible pour cette page.
                  </p>
                )}
              </nav>

              {Object.entries(categories).map(([category, content]) => (
                <nav key={category} css={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".4em",
                }}>
                  <h2 css={{ margin: 0, fontSize: "1.4em" }}>
                    {content}
                  </h2>

                  {Object.entries(metadatas).filter(([_, metadata]) => metadata.group == category)
                    .map(([pageId, metadata]) => (
                      <Link key={pageId} to={`/wiki/${pageId == "main" ? "" : pageId}`}>
                        {String(metadata.realTitle)}
                      </Link>
                    ))}
                </nav>
              ))}
            </div>

            <div
              css={{
                padding: "2em",
                maxHeight: "100vh",
                overflow: "scroll",

                "&>div": {
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                },

                "& h1, & h2, & p:not([data-native])": {
                  margin: 0,
                }
              }}
            >
              {body}
            </div>
          </div>
        </>
      )}
    </ActionsHandler>
  );
}

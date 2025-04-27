import { css } from "@emotion/react";
import { IconBrandDiscord, IconBrandInstagram, IconBrandThreads, IconMail } from "@tabler/icons-react";
import { ReactNode, useEffect } from "react";
import { useParams } from "react-router";
import { useDocumentTitle } from "./utils/dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const styles = {
  container: css({
    position: "absolute",
    inset: 0,
    display: "grid",
    gridTemplateAreas: `"title" "content" "footer"`,
    gridTemplateRows: "auto 1fr auto",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    overflow: "scroll",
    padding: "0 1em",

    "@media (prefers-color-scheme: dark)": {
      backgroundColor: "#121212",
    },
  }),
  title: css({
    gridArea: "title",
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  }),
  footer: css({
    gridArea: "footer",
    fontSize: "0.8rem",
    color: "#888",
    textAlign: "center",

    "@media (prefers-color-scheme: dark)": {
      color: "#ccc",
    },
  }),
}

export type Linktree = Record<string, {
  title: string;
  description: string;

  nodes: Leaf[];
}>;

export type Leaf = { text: string; } & ({
  type: "text";
} | {
  type: "link";
  url: string;
  icon: ReactNode;
  color: number;
});

const trees: Linktree = {
  mejib: {
    title: "Mejib 💛",
    description: "Les liens associés à Mejib, la peluche Minion de 7,50 €.",
    nodes: [
      {
        type: "link",
        text: "Instagram",
        url: "https://instagram.com/le_minion_a_7.50",
        icon: <IconBrandInstagram />,
        color: 0xE1306C,
      },
      {
        type: "link",
        text: "Threads",
        url: "https://threads.net/le_minion_a_7.50",
        icon: <IconBrandThreads />,
        color: 0x000000,
      },
      {
        type: "link",
        text: "Discord (mairech.cc)",
        url: "https://mairech.cc/discord",
        icon: <IconBrandDiscord />,
        color: 0x7289DA,
      },
      {
        type: "text",
        text: "Pour me contacter, privilegiez le courriel professionnel.",
      },
      {
        type: "link",
        text: "Courriel professionnel",
        url: "mailto:mejib-contact@mairech.cc",
        icon: <IconMail />,
        color: 0xFF0000,
      }
    ]
  },
};

export default function Linktree() {
  const { page } = useParams();
  const [domTitle, setTitle] = useDocumentTitle();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const t = trees[page!]?.title || "404";

    if (domTitle != t) {
      setTitle(t);
    }
  }, [page, domTitle, setTitle]);

  const all = trees[page!];

  if (!all) {
    return (
      <div css={styles.container}>
        <h1 css={styles.title}>404</h1>

        <div css={{
          boxSizing: "border-box",
          gridArea: "content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1em",
          gap: "1em",
          width: "100%",
        }}>
          <p>Page non trouvée</p>
        </div>

        <p css={styles.footer}>
          ©️ {new Date().getFullYear()} mairech.cc — Tous droits réservés. <br />

          <a href="https://mairech.cc/github" target="_blank" rel="noopener noreferrer">
            <strong>Source</strong>
          </a>
        </p>
      </div>
    );
  }

  const { title, description, nodes } = all;

  return (
    <div css={styles.container}>
      <h1 css={styles.title}>{title}</h1>

      <div css={{
        boxSizing: "border-box",
        gridArea: "content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1em",
        gap: "1em",
        width: "100%",
        maxWidth: "min(600px, 90vw)",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0, y: reducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: reducedMotion ? 0 : 0, transition: { duration: 0.2 } }}
          >
            {description}
          </motion.p>

          {nodes.map((node, i) => {
            const props = {
              initial: { opacity: 0, y: reducedMotion ? 0 : -20 },
              animate: { opacity: 1, y: reducedMotion ? 0 : 0, transition: { duration: 0.2, delay: (i + 1) * 0.05 } },
            }

            if (node.type == "text") {
              return (
                <motion.p key={i} {...props}>
                  {node.text}
                </motion.p>
              );
            }

            let url = new URL(node.url);

            if (url.protocol.startsWith("http")) {
              url = new URL(`https://l.julman.fr/click?target=${encodeURIComponent(node.url)}&companion=mairech&source=linktree`);
            }

            return (
              <motion.a
                key={i}
                href={url.href}
                target="_blank"
                rel="noopener noreferrer"
                css={{
                  backgroundColor: `#${node.color.toString(16).padStart(6, "0")}`,
                  borderRadius: ".5em",
                  padding: "1em",
                  textAlign: "center",
                  color: "#fff",
                  textDecoration: "none",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".5em",
                  fontSize: "1.2em",
                  transition: "font-size .2s ease-in-out",

                  "&:hover": {
                    opacity: 0.8,

                    "@media not (prefers-reduced-motion)": {
                      fontSize: "1.5em",
                    }
                  },
                }}
                {...props}
              >
                {node.icon}

                <span>{node.text}</span>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>

      <p css={styles.footer}>
        ©️ {new Date().getFullYear()} mairech.cc — Tous droits réservés. <br />

        <a href="https://mairech.cc/github" target="_blank" rel="noopener noreferrer">
          <strong>Source</strong>
        </a>
      </p>
    </div>
  );
}

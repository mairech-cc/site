import { memo, useEffect, useMemo, useState, type ComponentType } from "react";
import { render } from "katex";
import { useNavigate } from "react-router";
import { shiki } from "../modules/cplayer/utils";
import { categories, engines } from "./data.json";

const metadatas: Record<string, Record<string, unknown>> = {};
const pages: Record<string, ComponentType> = {};
const contents: Record<string, { level: string; content: string }[]> = {};
const adapters: Record<string, "markdown" | "react" | "unknown"> = {};

const parser = new DOMParser();

import * as mainPage from "./pages/main.md";
bindPage("main", mainPage.attributes, mainPage.html, mainPage.toc, "markdown");

import * as max7219DotMatrix from "./pages/max7219-dot-matrix.md";
bindPage("max7219-dot-matrix", max7219DotMatrix.attributes, max7219DotMatrix.html, max7219DotMatrix.toc, "markdown");

import { AnnalesPage } from "./pages/annales";
import { attributes as annalesAttributes, toc as annalesToc } from "./pages/annales-data";
bindPage("annales", annalesAttributes, AnnalesPage, annalesToc, "react");

function bindPage(key: string, metadata: Record<string, unknown>, page: string | ComponentType, content: {
  level: string;
  content: string;
}[], adapter: "markdown" | "react" | "unknown") {
  metadatas[key] = metadata;
  pages[key] = typeof page == "string" ? bindHtmlRenderer(key, page) : bindRenderer(key, page);
  contents[key] = content;
  adapters[key] = adapter;
}

function bindHtmlRenderer(name: string, html: string) {
  const parsed = parser.parseFromString(html, "text/html");

  const headings = parsed.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6");
  const maths = parsed.querySelectorAll<HTMLElement>("tex");
  const codeHightlights = parsed.querySelectorAll<HTMLElement>('code[class^="language-"]');

  [...headings].forEach((heading, i) => heading.id = `section-${i}`);

  for (const tex of maths) {
    const temp = parsed.createElement("div");
    render(tex.textContent!, temp, {
      displayMode: tex.hasAttribute("display"),
    });
    tex.replaceWith(...temp.childNodes);
    temp.remove();
  }

  for (const code of codeHightlights) {
    const div = parsed.createElement("div");
    div.innerHTML = shiki.codeToHtml(code.textContent ?? "error: no code provided", {
      lang: code.className.substring(9),
      theme: "github-dark",
    });
    const product = div.firstElementChild! as HTMLElement;
    product.style.minWidth = "min(100%,20em)";
    product.style.width = "max-content";
    product.style.borderRadius = "1em";
    product.style.padding = "1em";
    product.style.margin = "0";
    code.parentElement!.replaceWith(...div.childNodes);
  }

  const component = memo(() => {
    const root = useMemo(() => parsed.cloneNode(true) as Document, []);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
      const elements = [...root.querySelectorAll("a")];

      function handleClick(anchor: HTMLAnchorElement, e: MouseEvent) {
        const url = new URL(anchor.href, location.href);

        if (url.host == location.host) {
          e.preventDefault();
          navigate(url.pathname);
        }
      }

      const map = elements.map(x => [x, handleClick.bind(null, x)] as const);

      for (const [anchor, handler] of map) {
        anchor.addEventListener("click", handler);
      }

      return () => {
        for (const [anchor, handler] of map) {
          anchor.removeEventListener("click", handler);
        }
      }
    }, [root, navigate]);

    useEffect(() => {
      if (!ref || ref.dataset.handled == "true") {
        return;
      }

      ref.dataset.handled = "true";

      for (const child of [...root.body.childNodes]) {
        ref.appendChild(child);
      }
    }, [ref, root]);

    return (
      <div
        ref={setRef}
        css={{
          "& table": {
            borderCollapse: "collapse",

            "& th, & td": {
              border: "1px solid black",
              padding: ".5em",

              "@media (prefers-color-scheme: dark)": {
                borderColor: "white",
              }
            }
          }
        }}
      />
    );
  });

  if (import.meta.env.DEV) {
    Object.assign(component, { displayName: `HTML for ${name}` });
  }

  return component;
}

function bindRenderer(name: string, Page: ComponentType) {
  const component = memo(() => {
    return (
      <div
        children={<Page />}
        css={{
          "& table": {
            borderCollapse: "collapse",

            "& th, & td": {
              border: "1px solid black",
              padding: ".5em",

              "@media (prefers-color-scheme: dark)": {
                borderColor: "white",
              }
            }
          }
        }}
      />
    );
  });

  if (import.meta.env.DEV) {
    Object.assign(component, { displayName: `Styles for ${name}` });
  }

  return component;
}

export { categories, engines, metadatas, pages, contents, adapters };

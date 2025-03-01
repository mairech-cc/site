import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import webfontDownload from "vite-plugin-webfont-dl";
import EntryShakingPlugin from "vite-plugin-entry-shaking";
import { plugin as mdPlugin, Mode } from "vite-plugin-markdown";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    webfontDownload(),
    EntryShakingPlugin({
      targets: [
        "@tabler/icons-react",
      ],
    }),
    mdPlugin({
      mode: [Mode.TOC, Mode.HTML],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash:20].js',
        chunkFileNames: 'assets/[hash:20].js',
        assetFileNames: 'assets/[hash:20][extname]',
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-error-boundary",
            "react-router",
            "@emotion/cache",
            "@emotion/react",
            "@emotion/styled",
            "@floating-ui/react",
            "@tabler/icons-react"
          ],
          shiki: [
            "@shikijs/langs",
            "@shikijs/themes",
            "shiki",
          ],
          term: [
            "@xterm/addon-fit",
            "@xterm/addon-web-links",
            "@xterm/addon-webgl",
            "@xterm/xterm",
            "@wasmer/sdk",
            "path-browserify"
          ],
          other: [
            "js-confetti",
            "leaflet",
            "katex",
          ]
        }
      },
    },
    target: 'esnext'
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  }
});

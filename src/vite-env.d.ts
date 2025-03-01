/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.md" {
  export const toc: { level: string; content: string; }[];
  export const attributes: Record<string, unknown>;
  export const html: string;
}

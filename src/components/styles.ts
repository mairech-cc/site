import type { CSSObject } from "@emotion/react";

/**
 * Keeps the container scrollable without scrollbars visible.
 */
export const scrollbarsInvisible = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },
} satisfies CSSObject;

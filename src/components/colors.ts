import { CSSObject } from "@emotion/react";
import { CSSProperties } from "react";

export interface ThemeColor {
  light: string;
  dark: string;
}

export function uniqueColor(color: string): ThemeColor {
  return {
    light: color,
    dark: color,
  };
}

export function theme(light: string | ThemeColor, dark: string | ThemeColor): ThemeColor {
  return {
    light: typeof light == "string" ? light : light.light,
    dark: typeof dark == "string" ? dark : dark.dark,
  };
}

const white = uniqueColor("#ffffff");
const black = uniqueColor("#000000");
const text = theme(white, black);
const alert = theme("#ffa8a8", "#ff4d4d");
const overlay = theme("#d3d3d3", "#494949");
const border = uniqueColor("#808080");

const primary = theme("#4dabf7", "#339af0");
const success = theme("#69db7c", "#38d9a9");
const warning = theme("#ffd43b", "#fcc419");
const error = alert;

const background = theme("#f8f9fa", "#121212");
const muted = theme("#e9ecef", "#2b2b2b");

export const palette = {
  white, black, text,
  alert, overlay, border,

  primary, success, warning,
  error, background, muted,
};

function relativeLuminance(hex: string): number {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const r = parseInt(sanitized.slice(0, 2), 16) / 255;
  const g = parseInt(sanitized.slice(2, 4), 16) / 255;
  const b = parseInt(sanitized.slice(4, 6), 16) / 255;

  const [R, G, B] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Chooses the correct text color (from palette.text) based on the background.
 * Accepts a string or ThemeColor. Returns the text color that ensures good contrast.
 */
export function getAccessibleTextColor(bg: string | ThemeColor): ThemeColor {
  const lightBg = typeof bg === "string" ? bg : bg.light;
  const darkBg = typeof bg === "string" ? bg : bg.dark;

  const lightLuma = relativeLuminance(lightBg);
  const darkLuma = relativeLuminance(darkBg);

  return {
    light: lightLuma > 0.179 ? palette.text.dark : palette.text.light,
    dark: darkLuma > 0.179 ? palette.text.dark : palette.text.light,
  };
}


export const darkValue = Symbol.for("theming.dark-props");

export interface ThemedCSSObject extends CSSObject {
  [darkValue]: CSSObject;
}

export interface ThemedBuilder {
  <K extends keyof CSSProperties>(key: K): (strings: TemplateStringsArray, ...expressions: (string | number | ThemeColor)[]) => ThemedBuilder;
  (darkStyle: CSSProperties): ThemedBuilder;
}

/**
 * This is a helper method to use the palette in Emotion.
 * 
 * Note: Do NOT add your own "@media (prefers-color-scheme: dark)" rules.
 * Use `themed()` exclusively to apply dark-mode styles.
 *
 * You can pass a full CSSProperties for dark-only styles:
 * ```js
 * themed(b => b({ backgroundColor: '#000' }))
 * ```
 *
 * Or use the chained builder for light/dark themed values:
 * ```js
 * themed(b => b("color")`${palette.alert}`)
 * ```
 */
export function themed<T extends "light" | "dark" | "auto" = "auto">(
  callback: (b: ThemedBuilder) => void,
  theme: T = "auto" as T
): T extends "auto" ? ThemedCSSObject : CSSObject {
  const values: Partial<Record<keyof CSSProperties, [string, string]>> = {};

  const builder = (<K extends keyof CSSProperties>(key: K | CSSProperties) => {
    if (typeof key == "object") {
      for (const [k, v] of Object.entries(key) as [keyof CSSProperties, unknown][]) {
        if (v == undefined) {
          if (import.meta.env.DEV) {
            console.warn("Received an undefined value");
          }
        }

        values[k] = ["", String(v)];
      }

      return builder;
    }

    return (strings: TemplateStringsArray, ...expressions: (string | number | ThemeColor)[]) => {
      let [light, dark] = [strings[0], strings[0]];

      for (let i = 0; i < expressions.length; i++) {
        const e = expressions[i];

        if (typeof e == "object" && "light" in e && "dark" in e) {
          light += e.light + strings[i + 1];
          dark += e.dark + strings[i + 1];
        } else {
          light += e + strings[i + 1];
          dark += e + strings[i + 1];
        }
      }

      values[key] = [light, dark];

      return builder;
    };
  }) as ThemedBuilder;

  callback(builder);

  const [light, dark]: [CSSObject, CSSObject] = [{}, {}];

  for (const [k, [l, d]] of Object.entries(values)) {
    light[k] = l;

    if (l != d || theme != "auto") {
      dark[k] = d;
    }
  }

  if (theme == "light") {
    return light as T extends "auto" ? ThemedCSSObject : CSSObject;
  }

  if (theme == "dark") {
    return dark as T extends "auto" ? ThemedCSSObject : CSSObject;
  }

  if (Object.keys(dark).length == 0) {
    return {
      ...light,
      [darkValue]: light,
    }
  };

  return {
    ...light,

    "@media (prefers-color-scheme: dark)": dark,
    [darkValue]: dark,
  } as ThemedCSSObject;
}

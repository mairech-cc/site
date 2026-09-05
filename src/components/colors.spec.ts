import { describe, it, expect, spyOn } from "bun:test";
import { themed, palette, ThemedCSSObject, darkValue, opposite, theme } from "./colors";
import { getAccessibleTextColor, ThemeColor } from "./colors";

describe("themed", () => {
  it("generates light/dark CSSObject with ThemeColor expressions", () => {
    const style = themed(b =>
      b("color")`${palette.alert}`("border")`1px solid ${palette.border}`
    );

    expect(style.color).toBe(palette.alert.light);
    expect(style.border).toBe(`1px solid ${palette.border.light}`);

    const dark = (style as ThemedCSSObject)[darkValue];
    expect(dark.color).toBe(palette.alert.dark);
    expect(dark.border).toBeUndefined(); // same as light

    expect(style["@media (prefers-color-scheme: dark)"]).toEqual(dark);
  });

  it("supports static dark-only CSSProperties", () => {
    const style = themed(b => b({ backgroundColor: "#111111" }));

    expect(style.backgroundColor).toBe("");
    expect((style as ThemedCSSObject)[darkValue].backgroundColor).toBe("#111111");
    expect(style["@media (prefers-color-scheme: dark)"]).toEqual({
      backgroundColor: "#111111",
    });
  });

  it("returns only light style when theme is 'light'", () => {
    const style = themed(
      b => b("color")`${palette.alert}`,
      "light"
    );

    expect(style).toEqual({
      color: palette.alert.light,
    });
  });

  it("returns only dark style when theme is 'dark'", () => {
    const style = themed(
      b => b("color")`${palette.alert}`,
      "dark"
    );

    expect(style).toEqual({
      color: palette.alert.dark,
    });
  });

  it("warns on undefined values in dev mode", () => {
    const spy = spyOn(console, "warn").mockImplementation(() => { });
    import.meta.env.DEV = true;

    themed(b => {
      b({ border: undefined });
    });

    expect(spy).toHaveBeenCalledWith("Received an undefined value");
    spy.mockRestore();
  });

  it("supports strings interpolation", () => {
    const style = themed(b => b("border")`1px solid ${"red"}`);

    const ret = { border: "1px solid red" };
    expect(style).toEqual({ ...ret, [darkValue]: ret });
  });
});

describe("getAccessibleTextColor", () => {
  it("returns dark text for light backgrounds", () => {
    const bg = "#ffffff";
    const result = getAccessibleTextColor(bg);
    expect(result.light).toBe(palette.text.dark);
    expect(result.dark).toBe(palette.text.dark);
  });

  it("returns light text for dark backgrounds", () => {
    const bg = "#000000";
    const result = getAccessibleTextColor(bg);
    expect(result.light).toBe(palette.text.light);
    expect(result.dark).toBe(palette.text.light);
  });

  it("handles ThemeColor input", () => {
    const bg: ThemeColor = { light: "#f8f9fa", dark: "#121212" };
    const result = getAccessibleTextColor(bg);
    expect(result.light).toBe(palette.text.dark);
    expect(result.dark).toBe(palette.text.light);
  });

  it("returns correct text color for mid-tone backgrounds", () => {
    const bg = "#888888";
    const result = getAccessibleTextColor(bg);
    // #888888 has luminance > 0.179, so should return dark text
    expect(result.light).toBe(palette.text.dark);
    expect(result.dark).toBe(palette.text.dark);
  });

  it("throws on invalid hex color", () => {
    expect(() => getAccessibleTextColor("#fff")).toThrowError();
    expect(() => getAccessibleTextColor("#12345")).toThrowError();
    expect(() => getAccessibleTextColor("not-a-color")).toThrowError();
  });
});

describe("opposite", () => {
  it("handles correct theme swap", () => {
    expect(opposite(palette.black)).toEqual(palette.black);
    expect(opposite(palette.white)).toEqual(palette.white);
    const basicColor = theme(palette.white, palette.black);
    const opposed = theme(palette.black, palette.white);
    expect(opposite(basicColor)).toEqual(opposed);
  });
});

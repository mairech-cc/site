import { describe, it, expect, spyOn } from "bun:test";
import { themed, palette, ThemedCSSObject, darkValue } from "./colors";

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
});

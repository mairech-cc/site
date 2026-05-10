import { describe, it, expect, mock } from "bun:test";
import React from "react";
import createStrictComponentFactory, {
  P,
  transform,
} from "./props";

describe("P.ref", () => {
  it("should validate function refs", () => {
    const refType = P.ref<HTMLInputElement>();
    expect(refType["__@F"](mock())).toBe(true);
  });

  it("should validate object refs", () => {
    const refType = P.ref<HTMLInputElement>();
    expect(refType["__@F"]({ current: null })).toBe(true);
  });

  it("should not validate non-ref values", () => {
    const refType = P.ref<HTMLInputElement>();
    expect(refType["__@F"](123)).toBe(false);
    expect(refType["__@F"](null)).toBe(false);
    expect(refType["__@F"]({})).toBe(false);
  });
});

describe("P.color", () => {
  it("should validate string colors", () => {
    const colorType = P.color();
    expect(colorType["__@F"]("red")).toBe(true);
  });

  it("should validate ThemeColor objects", () => {
    const colorType = P.color();
    expect(colorType["__@F"]({ light: "#fff", dark: "#000" })).toBe(true);
  });

  it("should not validate invalid objects", () => {
    const colorType = P.color();
    expect(colorType["__@F"]({})).toBe(false);
    expect(colorType["__@F"]({ light: "#fff" })).toBe(false);
    expect(colorType["__@F"](123)).toBe(false);
  });
});

describe("P.optional", () => {
  it("should mark prop as optional and set default", () => {
    const base = P.string();
    const opt = P.optional(base, "default");
    expect(opt["__@U"]).toBe(true);
    expect(opt["__@D"]).toBe("default");
    expect(opt["__@F"]("foo")).toBe(true);
    expect(opt["__@F"](123)).toBe(false);
  });
});

describe("P.string, P.number, P.boolean", () => {
  it("should validate string", () => {
    expect(P.string()["__@F"]("foo")).toBe(true);
    expect(P.string()["__@F"](123)).toBe(false);
  });
  it("should validate number", () => {
    expect(P.number()["__@F"](123)).toBe(true);
    expect(P.number()["__@F"]("foo")).toBe(false);
  });
  it("should validate boolean", () => {
    expect(P.boolean()["__@F"](true)).toBe(true);
    expect(P.boolean()["__@F"](false)).toBe(true);
    expect(P.boolean()["__@F"]("true")).toBe(false);
  });
});

describe("P.children", () => {
  it("should validate string, number, boolean, null, undefined", () => {
    const c = P.children()["__@F"];
    expect(c("foo")).toBe(true);
    expect(c(123)).toBe(true);
    expect(c(true)).toBe(true);
    expect(c(undefined)).toBe(true);
    expect(c(null)).toBe(true);
  });

  it("should validate React elements", () => {
    const c = P.children()["__@F"];
    expect(c(React.createElement("div"))).toBe(true);
  });

  it("should validate arrays of valid children", () => {
    const c = P.children()["__@F"];
    expect(c(["foo", 123, React.createElement("span")])).toBe(true);
  });

  it("should validate iterators of valid children", () => {
    const c = P.children()["__@F"];
    expect(c(["foo", 123, React.createElement("span")].values())).toBe(true);
  });

  it("should invalidate iterators of invalid children", () => {
    const c = P.children()["__@F"];
    expect(c(["foo", {}, 123].values())).toBe(false);
  });

  it("should invalidate arrays with invalid children", () => {
    const c = P.children()["__@F"];
    expect(c(["foo", {}, 123])).toBe(false);
  });
});

describe("P.enum", () => {
  it("should validate values in enum", () => {
    const colorEnum = P.enum(["red", "green", "blue"]);
    expect(colorEnum["__@F"]("red")).toBe(true);
    expect(colorEnum["__@F"]("green")).toBe(true);
    expect(colorEnum["__@F"]("blue")).toBe(true);
  });

  it("should not validate values not in enum", () => {
    const colorEnum = P.enum(["red", "green", "blue"]);
    expect(colorEnum["__@F"]("yellow")).toBe(false);
    expect(colorEnum["__@F"](123)).toBe(false);
    expect(colorEnum["__@F"](null)).toBe(false);
  });

  it("should work with number enums", () => {
    const numEnum = P.enum([1, 2, 3]);
    expect(numEnum["__@F"](1)).toBe(true);
    expect(numEnum["__@F"](2)).toBe(true);
    expect(numEnum["__@F"](4)).toBe(false);
    expect(numEnum["__@F"]("1")).toBe(false);
  });
});

describe("P.object", () => {
  it("should validate objects matching schema", () => {
    const schema = P.object({
      a: P.string(),
      b: P.optional(P.number()),
    });

    // this is useless but required to full coverage. (this function always returns false for any input)
    expect(schema["__@F"]({ })).toBe(false);

    expect(() => transform(
      { obj: schema },
      { obj: { a: "foo" } }
    )).not.toThrow();
    expect(() => transform(
      { obj: schema },
      { obj: { a: "foo", b: 123 } }
    )).not.toThrow();
    expect(() => transform(
      { obj: schema },
      { obj: { a: "foo", b: undefined } }
    )).not.toThrow();
  });

  it("should invalidate objects not matching schema", () => {
    const schema = P.object({
      a: P.string(),
      b: P.optional(P.number()),
    });
    expect(() => transform(
      { obj: schema },
      { obj: {} }
    )).toThrow();
    expect(() => transform(
      { obj: schema },
      { obj: { a: 123 } }
    )).toThrow();
    expect(() => transform(
      { obj: schema },
      { obj: { a: "foo", b: "bar" } }
    )).toThrow();
  });

  it("should not validate non-objects", () => {
    const schema = P.object({
      a: P.string(),
    });
    expect(() => transform({ obj: schema }, { obj: null })).toThrow();
    expect(() => transform({ obj: schema }, { obj: 123 })).toThrow();
    expect(() => transform({ obj: schema }, { obj: "foo" })).toThrow();
    expect(() => transform({ obj: schema }, { obj: [1, 2, 3] })).toThrow();
  });
});

describe("transform", () => {
  const props = {
    foo: P.string(),
    bar: P.optional(P.number(), 42),
    baz: P.boolean(),
  };

  it("should transform valid props", () => {
    const result = transform(props, { foo: "abc", baz: true });
    expect(result.foo).toBe("abc");
    expect(result.bar).toBe(42);
    expect(result.baz).toBe(true);
  });

  it("should throw if required prop missing", () => {
    expect(() => transform(props, { baz: true })).toThrow(/foo/);
  });

  it("should throw if type invalid", () => {
    expect(() => transform(props, { foo: 123, baz: true })).toThrow(/foo/);
    expect(() => transform(props, { foo: "abc", baz: "no" })).toThrow(/baz/);
  });

  it("should use provided optional value", () => {
    const result = transform(props, { foo: "abc", bar: 99, baz: false });
    expect(result.bar).toBe(99);
  });
});

describe("createStrictComponentFactory", () => {
  const props = {
    foo: P.string(),
    bar: P.optional(P.number(), 42),
  };

  it("should create a component that validates props", () => {
    const factory = createStrictComponentFactory(props);
    const Comp = factory(({ foo, bar }) => React.createElement("span", null, `${foo}:${bar}`));
    // Should not throw
    expect(() => Comp({ foo: "hi" })).not.toThrow();
    expect(() => Comp({ foo: "hi", bar: 99 })).not.toThrow();
    // Should throw on invalid
    //@ts-expect-error testing
    expect(() => Comp({ foo: 123 })).toThrow();
    //@ts-expect-error testing
    expect(() => Comp({})).toThrow();
  });

  it("should support memoization", () => {
    const factory = createStrictComponentFactory(props, { memoized: true });
    const Comp = factory(({ foo, bar }) => React.createElement("span", null, `${foo}:${bar}`));
    // @ts-expect-error $$typeof is a React hidden key.
    expect(Comp.$$typeof).toBe(Symbol.for("react.memo"));
  });

  it("should set displayName on the component", () => {
    const factory = createStrictComponentFactory(props, { displayName: "TestComp" });
    const Comp = factory(({ foo, bar }) => React.createElement("span", null, `${foo}:${bar}`));
    expect(Comp.displayName).toBe("TestComp");
  });
});

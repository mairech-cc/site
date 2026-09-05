import { isValidElement, memo, type ComponentType, type FC } from "react";
import type { ThemeColor } from "./colors";

export enum ColorScheme {
  Auto = "auto",
  Light = "light",
  Dark = "dark",
}

export type ___P<T, U extends boolean = false, R extends boolean = false> = {
  /**
   * This key is only used to detect the type on TypeScript, *never* defined.
   * 
   * This is only used to store the schema if "__@R" is true.
   */
  "__@T"?: T;
  /**
   * This defines the checker of the prop.
   */
  "__@F"(v: unknown): v is T;
  /**
   * This defines if the key is optional.
   */
  "__@U": U;
  /**
   * This defines the default value if key omitted, requires "__@U" to be true.
   */
  "__@D": T | undefined;
  /**
   * This defines if the type checking is recursive. This modifies the behavior of the returned transformed type.
   */
  "__@R": R;
};

/**
 * Makes the passed prop type optional.
 * 
 * ```ts
 * type P = {
 *   text: P_Optional<P_Raw<string>>;
 * };
 * ```
 * is transformed to
 * ```ts
 * type T = {
 *   text?: string;
 * };
 * ```
 */
export type P_Optional<T> = T extends ___P<infer U, boolean, infer R> ?
  ___P<U, true, R> :
  never;
export type P_Ref<T> = ___P<React.Ref<T>>;
export type P_Color = ___P<string | ThemeColor>;

export type ___PickFromValue<R extends Record<string | symbol | number, unknown>, T> = {
  [L in keyof R as R[L] extends T ? L : never]: R[L] extends T ? R[L] : never;
};

export type ___KeyOfOptionalP<T extends Record<string, ___P<unknown, boolean, boolean>>> =
  keyof ___PickFromValue<{ [K in keyof T]: T[K] extends ___P<unknown, infer U, boolean> ? U : never }, true>;

export type ___TP<T extends ___P<unknown, boolean, boolean>> = T extends ___P<infer U, boolean, infer R> ?
  R extends true ? U extends Record<string, ___P<unknown, boolean, boolean>> ? TransformP<U> : never : U : never;

export type TransformP<T extends Record<string, ___P<unknown, boolean, boolean>>> = {
  [K in ___KeyOfOptionalP<T>]?: ___TP<T[K]>;
} & {
  [K in keyof T as K extends ___KeyOfOptionalP<T> ? never : K]: ___TP<T[K]>;
}

function ref<T>(): P_Ref<T> {
  return {
    "__@F": (v): v is React.Ref<T> => typeof v == "function" || typeof v == "object" && !!v && "current" in v,
    "__@U": false,
    "__@D": undefined,
    "__@R": false,
  }
}

function color(): P_Color {
  return {
    "__@F": (v): v is string | ThemeColor => typeof v == "string" || (
      typeof v == "object" &&
      !!v &&
      "light" in v && typeof v.light == "string" &&
      "dark" in v && typeof v.dark == "string"
    ),
    "__@U": false,
    "__@D": undefined,
    "__@R": false,
  };
}

function optional<T, R extends boolean>(t: ___P<T, boolean, R>, def?: T): ___P<T, true, R> {
  return {
    ...t,
    "__@F": (v): v is T => typeof v == "undefined" || t["__@F"](v),
    "__@U": true,
    "__@D": def,
  };
}

function nativeType<T>(t: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"): () => ___P<T> {
  return () => ({
    "__@F": (v): v is T => typeof v == t,
    "__@U": false,
    "__@D": undefined,
    "__@R": false,
  });
}

function enumType<U extends string | number, T extends [U, ...U[]]>(list: T): ___P<T[number]> {
  return {
    "__@F": (v): v is U => list.includes(v as U),
    "__@U": false,
    "__@D": undefined,
    "__@R": false,
  }
}

function children(): ___P<React.ReactNode> {
  function c(v: unknown): v is React.ReactNode {
    if (Array.isArray(v)) {
      return v.every(x => c(x));
    }

    if (typeof v == "object" && v !== null && Symbol.iterator in v) {
      // @ts-expect-error [[iterator]] is checked just before.
      for (const w of v) {
        if (!c(w)) {
          return false;
        }
      }

      return true;
    }

    return (
      ["string", "number", "boolean", "undefined"].includes(typeof v) ||
      v === null ||
      isValidElement(v)
    );
  }

  return {
    "__@F": c,
    "__@U": false,
    "__@D": undefined,
    "__@R": false,
  }
}

function objectType<
  T extends Record<string, ___P<unknown, boolean, boolean>>
>(schema: T): ___P<T, false, true> {
  return {
    "__@T": schema,
    "__@F": (_): _ is T => false,
    "__@U": false,
    "__@D": undefined,
    "__@R": true,
  };
}

export const P = {
  ref,
  color,
  optional,
  string: nativeType<string>("string"),
  number: nativeType<number>("number"),
  boolean: nativeType<boolean>("boolean"),
  function: nativeType("function") as (<T extends (...args: never[]) => unknown>() => ___P<T, false, false>),
  children,
  enum: enumType,
  object: objectType,
}

export function transform<TProps extends Record<string, ___P<unknown, boolean, boolean>>>(
  props: TProps,
  values: Record<string, unknown>,
): TransformP<TProps> {
  const val = { ...values };

  for (const [k, v] of Object.entries(props)) {
    if (!(k in val)) {
      if (v["__@U"]) {
        val[k] = v["__@D"];
        continue;
      } else {
        throw new Error(`"${k}" required but not given in props`);
      }
    }

    if (v["__@R"]) {
      //@ts-expect-error typescript doesn't allow that
      val[k] = transform(v["__@T"]!, val[k]);
      continue;
    }

    if (!v["__@F"](val[k])) {
      throw new Error(`"${k}" is invalid for the requested type`);
    }
  }

  return val as TransformP<TProps>;
}

export interface ComponentFactory<P> {
  (component: FC<P>): FC<P>;
}

export interface FactoryOptions {
  /**
   * Indicates if the output component should be memoized (using React's memo).
   * 
   * @default false
   */
  memoized?: boolean;
  /**
   * Describes the display name for the React DevTools.
   * 
   * @default null
   */
  displayName?: string | null;
}

/**
 * Note: The props object is not strict, more props can be given to component but won't be passed to inner component.
 */
export default function createStrictComponentFactory<TProps extends Record<string, ___P<unknown, boolean, boolean>>>(
  props: TProps,
  options: FactoryOptions = {},
): ComponentFactory<TransformP<TProps>> {
  return function builder(component: FC<TransformP<TProps>>) {
    // We need to shallow copy "props" to avoid possible mutations, avoid React errors.
    const definedProps = { ...props };

    function Component(p: TransformP<TProps>) {
      return component(transform(definedProps, p));
    }

    let output: ComponentType<TransformP<TProps>> = Component;

    if (options.memoized == true) {
      output = memo(Component);
    }

    if (typeof options.displayName == "string" && options.displayName.length >= 1) {
      Object.assign(output, { displayName: options.displayName });
    }

    return output;
  }
}

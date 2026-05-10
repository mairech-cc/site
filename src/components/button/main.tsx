import IconLoader from "../../modules/loader";
import { getAccessibleTextColor, palette, themed } from "../colors";
import createStrictComponentFactory, { P } from "../props";

const ButtonBuilder = createStrictComponentFactory({
  children: P.children(),
  onClick: P.optional(P.function()),
  scheme: P.optional(P.enum(["light", "dark", "auto"]), "auto"),
  variant: P.optional(P.enum(["default", "colored"]), "default"),
  loading: P.optional(P.boolean(), false),
  className: P.optional(P.string()),
  size: P.optional(P.string()),
}, {
  memoized: true,
  displayName: "Button",
});

const Button = ButtonBuilder(({
  children,
  onClick,
  scheme,
  variant,
  loading,
  className,
  size,
}) => {
  const color = getAccessibleTextColor(variant == "default" ? palette.muted : palette.primary);

  return (
    <button onClick={onClick} className={className} css={[
      {
        width: size,
        border: "0px",
        padding: ".5em",
        borderRadius: ".5em",
        cursor: "pointer",
        fontSize: "1em",

        ...themed(b => [
          b("color")`${color}`
        ], scheme),
      },
      variant == "default" && {
        ...themed(b => [
          b("backgroundColor")`${palette.muted}`
        ], scheme),
      },
      variant == "colored" && {
        ...themed(b => [
          b("backgroundColor")`${palette.primary}`
        ], scheme),
      }
    ]}>
      {loading ? <IconLoader size="1em" /> : children}
    </button>
  );
});

export default Button;

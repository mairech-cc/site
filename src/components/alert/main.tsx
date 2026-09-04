import { IconAlertTriangle } from "@tabler/icons-react";
import createStrictComponentFactory, { P } from "../props";
import { getAccessibleTextColor, palette, themed } from "../colors";

const AlertBuilder = createStrictComponentFactory({
  className: P.optional(P.string()),
  ref: P.optional(P.ref<HTMLDivElement>()),
  icon: P.optional(P.children()),
  children: P.children(),
  scheme: P.optional(P.enum(["light", "dark", "auto"]), "auto"),
  withBorder: P.optional(P.boolean(), true),
  color: P.optional(P.color(), "#ff6f6f"),
}, {
  memoized: true,
  displayName: "Alert",
});

const Alert = AlertBuilder(({
  className,
  ref,
  icon,
  children,
  scheme,
  withBorder,
  color,
}) => {
  const textColor = getAccessibleTextColor(color!);

  return (
    <div
      className={className}
      ref={ref}
      css={{
        display: "grid",
        gridTemplateColumns: "2em 1fr",
        // width: "100%",
        gap: "1em",
        padding: "1em",
        borderRadius: "1em",
        
        ...themed(b => [
          withBorder ? b("border")`1px solid ${palette.border}` : null,
          b("color")`${textColor}`,
          b("background")`${color!}`,
        ], scheme),
      }}
    >
      {icon || <IconAlertTriangle size="2em" />}

      <div>
        {children}
      </div>
    </div>
  );
});

export default Alert;

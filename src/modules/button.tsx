import styled from "@emotion/styled";
import { useFloating, useHover, useInteractions } from "@floating-ui/react";
import { createElement, forwardRef, Fragment, MouseEventHandler, PropsWithChildren, ReactNode, useState } from "react";

export const Button = styled.button({
  borderRadius: "8px",
  border: "1px solid transparent",
  padding: ".6em 1.2em",
  fontSize: "1em",
  fontWeight: "500",
  fontFamily: "inherit",
  backgroundColor: "#1a1a1a",
  cursor: "pointer",
  transition: "border-color .25s",

  "&:hover": {
    borderColor: "#646cff",
  },

  "&:focus, &:focus-visible": {
    outline: "4px auto -webkit-focus-ring-color",
  },

  "@media (prefers-color-scheme: light)": {
    "&": {
      backgroundColor: "#f9f9f9",
    },
  },
});

export type ActionButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
  theme?: "light" | "dark" | "auto";
}>;

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({ onClick, children, theme }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: ".25em",
        margin: ".5em .25em",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        borderRadius: "5px",

        ...theme != "auto" ? {
          "&:hover": {
            background: theme == "light" ? "#00000033" : "#ffffff22",
          }
        } : {
          "&:hover": {
            background: "#00000033",
          },

          "@media (prefers-color-scheme: dark)": {
            "&:hover": {
              background: "#ffffff22",
            }
          }
        }

      }}
    >
      {children}
    </button>
  );
});

export type TooltipProps = PropsWithChildren<{
  tooltip: ReactNode;
  className?: string | undefined;
}>;

/**
 * Warn: Both the children and tooltip are wrapped in divs, consider that for CSS queries.
 */
export function Tooltip({ children, tooltip, className }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    transform: true,
    onOpenChange: setIsOpen,
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    createElement<PropsWithChildren<{ className?: string; }>>(
      className ? "div" : Fragment,
      className ? { className } : {},
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>,

      isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          css={{
            background: "#eeeeee",
            color: "#000",
            padding: ".5em",
            borderRadius: "5px",
          }}
          {...getFloatingProps()}
        >
          {tooltip}
        </div>
      )
    )
  );
};

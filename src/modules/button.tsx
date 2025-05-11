import styled from "@emotion/styled";
import { useFloating, useHover, useInteractions, offset, flip, shift, arrow as floatingArrow, autoPlacement } from "@floating-ui/react";
import { createElement, forwardRef, Fragment, MouseEventHandler, PropsWithChildren, ReactNode, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Button = styled.button<{ scheme?: "light" | "dark" | "auto"; }>(props => ({
  borderRadius: "8px",
  border: "1px solid transparent",
  padding: ".6em 1.2em",
  fontSize: "1em",
  fontWeight: "500",
  fontFamily: "inherit",
  backgroundColor: "#1a1a1a",
  cursor: props.disabled ? "not-allowed" : "pointer",
  transition: "border-color .25s",

  "&:hover": {
    borderColor: "#646cff",
  },

  "&:focus, &:focus-visible": {
    outline: "4px auto -webkit-focus-ring-color",
  },

  ...props.scheme == "light" ? {
    backgroundColor: "#f9f9f9",
    color: "#000",
  } : {},

  ...(props.scheme == "auto" || !props.scheme) ? {
    "@media (prefers-color-scheme: light)": {
      "&": {
        backgroundColor: "#f9f9f9",
        color: "#000",
      },
    },
  } : {},
}));

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

export interface AnimatedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function AnimatedTooltip({ content, children }: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, refs, strategy, middlewareData } = useFloating({
    placement: "top",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 5 }),
      floatingArrow({ element: arrowRef }),
    ],
  });

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }["top"];

  const arrowStyle = middlewareData.arrow
    ? {
      left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : "",
      top: middlewareData.arrow.y != null ? `${middlewareData.arrow.y}px` : "",
      [staticSide]: "-4px",
    }
    : {};

  return (
    <>
      <div
        ref={refs.setReference}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              background: "#333",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              zIndex: 9999,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {content}

            {/* Arrow element */}
            <div
              ref={arrowRef}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                background: "#333",
                transform: "rotate(45deg)",
                ...arrowStyle,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

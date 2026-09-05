import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { palette, themed } from "../colors";

function StringRenderer<T>({ value, ref }: { value: T; ref: (instance: HTMLDivElement | null) => void; }) {
  if (typeof value != "string") {
    throw new Error("You need to provide a custom renderer for non-string values.");
  }

  return <div ref={ref}>{value}</div>;
}

export default function SegmentedControl<T extends string | { id: string; }>({
  values,
  component: Component = StringRenderer,
  value,
  onChange,
  scheme = "auto",
  className,
}: {
  values: T[];
  /**
   * This is required for non string values.
   */
  component?: React.ComponentType<{ value: T; ref: (instance: HTMLElement | null) => void; }>;
  value: string;
  onChange(value: string): void;
  scheme?: "light" | "dark" | "auto",
  className?: string,
}) {
  const selectedIndex = useMemo(() =>
    values.findIndex(x => typeof x == "string" ? x == value : x.id == value), [values, value]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [indicatorRect, setIndicatorRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || !itemRefs.current[selectedIndex]) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const selectedRect = itemRefs.current[selectedIndex].getBoundingClientRect();

    for (let i = 0; i < itemRefs.current.length; i++) {
      itemRefs.current[i]!.ariaSelected = String(i == selectedIndex);
    }

    setIndicatorRect({
      top: selectedRect.top - containerRect.top,
      left: selectedRect.left - containerRect.left,
      width: selectedRect.width,
      height: selectedRect.height,
    });
  }, [selectedIndex, values]);

  const setupValue = useCallback((ref: HTMLElement | null, key: number) => {
    itemRefs.current[key] = ref;

    if (ref && !ref.dataset.controlBound) {
      ref.addEventListener("click", () => {
        const v = values[key];
        onChange(typeof v == "string" ? v : v.id);
      });
      ref.role = "tab";
      ref.ariaSelected = String(selectedIndex == key);
      ref.style.position = "relative";
      ref.style.zIndex = "1";
      ref.tabIndex = -1;
      ref.dataset.controlBound = "true";
    }
  }, [onChange, values, selectedIndex]);

  const spring = {
    type: "spring",
    duration: .5
  } as const;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const maxIndex = values.length - 1;
    let nextIndex = selectedIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (selectedIndex + 1) > maxIndex ? 0 : selectedIndex + 1;
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (selectedIndex - 1) < 0 ? maxIndex : selectedIndex - 1;
        e.preventDefault();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        return;
      default:
        return;
    }

    const v = values[nextIndex];
    onChange(typeof v === "string" ? v : v.id);

    itemRefs.current[nextIndex]?.focus?.();
  };

  return (
    <div
      className={className}
      ref={containerRef}
      css={{
        position: "relative",
        display: "flex",
        gap: ".5em",
        borderRadius: "15px",
        placeContent: "space-around",

        ...themed(b => [
          b("background")`${palette.background}`
        ], scheme)
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="tablist"
      aria-orientation="horizontal"
    >
      <motion.div transition={spring} css={{
        position: "absolute",
        zIndex: 0,
        borderRadius: "15px",
        boxSizing: "border-box",

        ...themed(b => [
          b("background")`${palette.primary}`,
          b("border")`1px solid ${palette.text}`
        ], scheme)
      }} animate={indicatorRect} />

      {values.map((label, i) => (
        <Component
          key={i}
          value={label}
          ref={el => setupValue(el, i)}
        />
      ))}
    </div>
  )
}

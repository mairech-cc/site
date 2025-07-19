import { Global } from "@emotion/react";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { scrollbarsInvisible } from "../styles.ts";
import { AnimatedTooltip } from "../../modules/button";
import { ZIndexProvider } from "../../modules/zindex/zindex";
import IconLoader from "../../modules/loader";
import { ModalBlurContext, useShownModals } from "./context";

export default function Modal({
  title,
  children,
  containerRef,
  shown,
  onClose,
  rootId = "root",
  size = "auto",
  animate = "auto",
  allowEscape = true,
  allowClickOutside = true,
  withUi = true,
  withCloseButton = true,
  className,
  position = "center",
}: {
  title?: string;
  children?: ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
  shown: boolean;
  onClose?: () => void;
  rootId?: string;
  size?: string;
  animate?: "auto" | "all" | "none";
  allowEscape?: boolean;
  allowClickOutside?: boolean;
  withUi?: boolean;
  withCloseButton?: boolean;
  className?: string;
  position?: "center" | "bottom";
}) {
  const id = useId();
  const modals = useShownModals(v => v.shownModals);

  const lastShown = useMemo(() => modals[Math.max(modals.length - 1, 0)], [modals]);

  const [modalId, setModalId] = useState(0);
  const [modalDiv, setModalDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shown) {
      useShownModals.getState().add(id);
      setModalId(useShownModals.getState().getNewId());
    } else {
      useShownModals.getState().remove(id);
    }

    return () => useShownModals.getState().remove(id);
  }, [shown, id]);

  const zIndex = useMemo(() => modalId * 300 + 2000, [modalId]);

  const reducedMotion = useReducedMotion();

  const animations = useMemo(() => ({
    initial: animate == "none" ? {} : {
      opacity: 0,
      y: animate == "auto" && reducedMotion ? 0 : -30
    },
    animate: animate == "none" ? {} : {
      opacity: 1,
      y: 0,
    },
    exit: animate == "none" ? {} : {
      opacity: 0,
      y: animate == "auto" && reducedMotion ? 0 : 30
    }
  }), [animate, reducedMotion]);

  useEffect(() => {
    if (!shown || lastShown != id || !onClose) {
      return;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (shown && lastShown == id && e.key == "Escape" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onClose!();
      }
    }

    function onBodyClick(e: MouseEvent) {
      if (shown && lastShown == id && e.target == e.currentTarget) {
        e.preventDefault();
        onClose!();
      }
    }

    if (allowEscape) {
      document.body.addEventListener("keydown", onKeyDown);
    }

    if (allowClickOutside && modalDiv) {
      modalDiv.addEventListener("click", onBodyClick);
    }

    return () => {
      if (allowEscape) {
        document.body.removeEventListener("keydown", onKeyDown);
      }

      if (allowClickOutside && modalDiv) {
        modalDiv.removeEventListener("click", onBodyClick);
      }
    };
  }, [shown, lastShown, id, onClose, modalDiv, allowEscape, allowClickOutside]);

  return createPortal(
    <AnimatePresence>
      {lastShown == id && <Global styles={{
        ["#" + rootId]: {
          filter: shown ? "blur(5px)" : "none",
          transition: animate == "none" ? "" : "filter .3s",
        }
      }} />}

      {shown && <motion.div
        key={`modal-content-${id}`}
        initial={animations.initial}
        animate={animations.animate}
        exit={animations.exit}
        transition={{ duration: .3 }}
        ref={setModalDiv}
        style={{ zIndex }}
        css={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          display: "grid",
          placeItems: position == "center" ? "center" : "end center",
        }}
        id={`modal-content-${id}`}
        aria-hidden={!shown}
        role="alert"
      >
        <div
          className={className}
          ref={containerRef}
          css={[{
            display: "flex",
            flexDirection: "column",
            gap: ".5em",
            maxHeight: "90vh",
            overflowY: "scroll",
            width: size,
            margin: "1em",
            padding: "1em",

            filter: lastShown != id ? "blur(5px)" : "none",
            transition: animate == "none" ? "" : "filter .3s",
          }, scrollbarsInvisible, withUi ? {
            background: "lightgray",
            borderRadius: "1em",
            border: "1px gray solid",

            "@media (prefers-color-scheme: dark)": {
              background: "#505050",
            }
          } : {}]}
        >
          {(title || withCloseButton) && <div css={{
            display: "flex",
            justifyContent: "space-between",
            gap: "2em",
          }}>
            <span css={{ fontWeight: "bold", fontSize: "1.2em" }}>{title}</span>

            {withCloseButton && <AnimatedTooltip content="Fermer">
              <IconX css={{ cursor: "pointer" }} onClick={onClose} />
            </AnimatedTooltip>}
          </div>}

          <ZIndexProvider min={zIndex + 1} max={zIndex + 300}>
            <ModalBlurContext.Provider value={lastShown != id}>
              {children}
            </ModalBlurContext.Provider>
          </ZIndexProvider>
        </div>
      </motion.div>}
    </AnimatePresence >,
    document.body
  );
}

export function LoaderModal({ shown, rootId }: {
  shown: boolean;
  rootId?: string;
}) {
  return (
    <Modal
      shown={shown}
      size="3em"
      rootId={rootId}
      withCloseButton={false}
      withUi={false}
    >
      <IconLoader size="3em" />
    </Modal>
  );
}

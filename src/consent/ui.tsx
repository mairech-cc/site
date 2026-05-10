import { Suspense, useCallback, useEffect, useMemo, useState, startTransition } from "react";
import { createPortal } from "react-dom";
import Modal from "../components/modal/main";
import { useAllocateZIndex } from "../modules/zindex/zindex";
import { useCookieConsent } from "./main";
import { IconCookieFilled } from "@tabler/icons-react";
import { keyframes } from "@emotion/react";
import Button from "../components/button/main";
import { useModalBlur } from "../components/modal/context";
import IconLoader from "../modules/loader";
import SegmentedControl from "../components/segmented/main";
import { ServiceSkeleton } from "./service";

export default function CookiesConsent() {
  const {
    services,
    validateConsent,
    consent,
  } = useCookieConsent();

  const [showMore, setShowMore] = useState(false);
  const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);

  const sendConsent = useCallback((services: string[]) => {
    startTransition(() => {
      setLoading(true);
      validateConsent(services)
        .then(() => {
          setLoading(false);
        });
    });
  }, [validateConsent]);

  return (
    <>
      <Modal
        containerRef={setModalRef}
        shown={!consent.hasConsent}
        allowClickOutside={false}
        allowEscape={false}
        withCloseButton={false}
        position="bottom"
        size="70%"
      >
        <div css={{ display: "flex", flexDirection: "column", gap: ".5em", paddingLeft: "2em" }}>
          <RotatingCookie modalRef={modalRef} />

          <div css={{ fontWeight: "bold", fontSize: "1.2em" }}>
            Cookies
          </div>

          <div>
            Bienvenue sur mairech.cc ! Ce site utilise des technologies de suivi de sites Web tiers pour fournir et
            améliorer continuellement nos services en fonction des intérêts des utilisateurs.
          </div>

          <div css={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".25em",
            justifyContent: "space-between",
            width: "100%",

            "&>button": {
              flex: "1 1 12em",
              padding: ".5em 2em",
            }
          }}>
            <Button variant="colored" loading={loading} onClick={() => !loading && sendConsent(services.map(x => x.id))}>
              Tout autoriser
            </Button>

            <Button variant="colored" loading={loading} onClick={() => !loading && sendConsent([])}>
              Refuser
            </Button>

            <Button loading={loading} onClick={() => !loading && setShowMore(true)}>
              Plus...
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        shown={!consent.hasConsent && showMore}
        title="Gestion des cookies 🍪"
        css={{
          height: "90%",
          width: "calc(100vh-2rem)",
          maxWidth: "30rem",
        }}
        withCloseButton={false}
      >
        <Suspense fallback={<IconLoader />}>
          <ConsentModalBody />
        </Suspense>
      </Modal>
    </>
  );
}

const rotation = keyframes({
  "0%": { transform: "rotate(0)" },
  "100%": { transform: "rotate(1turn)" },
});

function RotatingCookie({ modalRef }: { modalRef: HTMLDivElement | null; }) {
  const zIndex = useAllocateZIndex();
  const shouldBlur = useModalBlur();

  const [sizing, setSizing] = useState(() => modalRef?.getBoundingClientRect());

  useEffect(() => {
    const int = setInterval(() => {
      setSizing(modalRef?.getBoundingClientRect());
    }, 100);

    function onResize() {
      setSizing(modalRef?.getBoundingClientRect());
    }

    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(int);
      window.removeEventListener("resize", onResize);
    }
  }, [modalRef]);

  return createPortal(
    <div css={{
      position: "fixed",
      left: sizing ? `${sizing.left - 50}px` : 0,
      top: sizing ? `${sizing.top - 40}px` : 0,
      zIndex: zIndex ?? undefined,
      filter: shouldBlur ? "blur(5px)" : undefined,
      animation: `${rotation} 5s linear infinite`,
      transition: "filter .3s",
    }}>
      <IconCookieFilled size="6em" />
    </div>,
    document.body
  );
}

function GroupRenderer({ value, ref }: { value: { id: string; text: string; }; ref: (instance: HTMLElement | null) => void; }) {
  return (
    <div ref={ref} css={{ padding: ".5em", cursor: "pointer" }}>
      {value.text}
    </div>
  )
}

function ConsentModalBody() {
  const consent = useCookieConsent();

  const [loading, setLoading] = useState(false);

  const sendConsent = useCallback((services: string[]) => {
    startTransition(() => {
      setLoading(true);
      consent.validateConsent(services)
        .then(() => {
          setLoading(false);
        });
    });
  }, [consent]);

  const serviceList = useMemo(() => Object.entries(consent.groups).map(x => ({
    id: x[0],
    ...x[1]
  })), [consent.groups]);
  const [tab, setTab] = useState<keyof typeof consent["groups"]>(serviceList[0].id as "essentials");

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  return (
    <div css={{ display: "flex", flexDirection: "column", gap: "1em", height: "100%", justifyContent: "space-between" }}>
      <div css={{ display: "flex", flexDirection: "column", gap: "1em" }}>
        <SegmentedControl
          values={serviceList}
          value={tab}
          onChange={v => setTab(v as keyof typeof consent["groups"])}
          component={GroupRenderer}
        />

        <p css={{ margin: 0 }}>{consent.groups[tab]?.description}</p>

        {consent.services.filter(x => x.group == tab).map(service => (
          <ServiceSkeleton
            key={service.id}
            service={service}
            selected={selected[service.id] ?? false}
            setSelected={v => setSelected(x => ({ ...x, [service.id]: v }))}
            required={consent.groups[tab]?.required ?? false}
          />
        ))}
      </div>

      <div css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: ".5em",
        paddingBottom: "1em",

        "&>button": {
          flex: "1 1 12em",
          padding: ".5em 2em",
        }
      }}>
        <Button
          variant="colored"
          size="100%"
          loading={loading}
          onClick={() => !loading && sendConsent(Object.entries(selected).filter(v => v[1]).map(x => x[0]))}
        >
          Valider
        </Button>

        <Button variant="default" size="100%" loading={loading} onClick={() => !loading && sendConsent(consent.services.map(x => x.id))}>
          Tout autoriser
        </Button>

        <Button variant="default" size="100%" loading={loading} onClick={() => !loading && sendConsent([])}>
          Refuser
        </Button>
      </div>
    </div>
  );
}

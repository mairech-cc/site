import { IconChevronUp } from "@tabler/icons-react";
import { themed, palette } from "../components/colors";
import { AnimatedTooltip } from "../modules/button";
import { Service } from "./main";
import { motion } from "framer-motion";
import { useState } from "react";

export function ServiceSkeleton({
  service,
  selected,
  setSelected,
  required
}: {
  service: Service;
  selected: boolean;
  setSelected: (v: boolean) => void;
  required: boolean;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <div css={{
      padding: ".5em",
      borderRadius: "1em",
      display: "grid",
      gridTemplate: '"a c" auto "b c" auto "d d" auto / 1fr 2em',
      gap: "0 .5em",
      alignItems: "center",

      ...themed(b => [
        b("background")`${palette.muted}`,
      ]),
    }}>
      {required ? <>
        <AnimatedTooltip content="Ce service est essentiel" css={{ gridArea: "c" }}>
          <input
            type="checkbox"
            checked
            disabled
            css={{ margin: 0, width: "1.5em", height: "1.5em" }}
          />
        </AnimatedTooltip>
      </> : <>
        <input
          type="checkbox"
          checked={selected}
          onChange={e => setSelected(e.currentTarget.checked)}
          css={{ gridArea: "c", margin: 0, width: "1.5em", height: "1.5em" }}
        />
      </>}

      <strong>{service.name}</strong>

      <p css={{ margin: 0 }}>
        {service.purpose}
      </p>

      <motion.div
        initial={{ height: "1.5em" }}
        animate={{ height: opened ? "auto" : "1.5em" }}
        transition={{ type: "spring", duration: .5 }}
        css={{
          gridArea: "d",
          margin: ".5em -.5em -.5em -.5em",
          borderRadius: "0 0 1em 1em",
          padding: ".5em",
          display: "flex",
          flexDirection: "column",
          gap: ".25em",
          overflow: "hidden",

          ...themed(b => [
            b("background")`${palette.border}`,
            b("color")`${palette.white}`,
            b("borderTop")`1px solid ${palette.black}`,
          ])
        }}
      >
        <div css={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }} onClick={() => setOpened(v => !v)}>
          <span css={{ fontFamily: '"Newsreader", serif' }}>Données collectées</span>

          <motion.span
            initial={{ rotate: "180deg" }}
            animate={{ rotate: opened ? "0deg" : "180deg" }}
            style={{ y: "-.25em" }}
          >
            <IconChevronUp size="1.5em" />
          </motion.span>
        </div>

        <ul css={{
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: ".25em .5em",
        }}>
          {service.collected.map(x => <li key={x} css={{
            width: "max-content",
            fontSize: ".9rem",
            padding: ".15em .25em",
            borderRadius: ".3em",

            ...themed(b => [
              b("background")`${palette.white}`,
              b("color")`${palette.border}`,
            ]),

            "&::marker": {
              content: '""',
            }
          }}>{x}</li>)}
        </ul>

        <span css={{ fontFamily: '"Newsreader", serif' }}>Rétention des données</span>

        <span css={{
          width: "max-content",
          fontSize: ".9rem",
          padding: ".15em .25em",
          borderRadius: ".3em",

          ...themed(b => [
            b("background")`${palette.white}`,
            b("color")`${palette.border}`,
          ]),
        }}>
          {service.retention}
        </span>

        {service.sentTo && (
          <>
            <span css={{ fontFamily: '"Newsreader", serif' }}>Données envoyées vers</span>

            <span css={{
              width: "max-content",
              fontSize: ".9rem",
              padding: ".15em .25em",
              borderRadius: ".3em",

              ...themed(b => [
                b("background")`${palette.white}`,
                b("color")`${palette.border}`,
              ]),
            }}>
              {service.sentTo.country}, pour {service.sentTo.recipient}
            </span>
          </>
        )}

        <span css={{ fontFamily: '"Newsreader", serif' }}>Liens</span>

        <ul css={{
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: ".25em .5em",
        }}>
          {service.links.map(x => <li key={x} css={{
            width: "max-content",
            fontSize: ".9rem",
            padding: ".15em .25em",
            borderRadius: ".3em",

            ...themed(b => [
              b("background")`${palette.white}`,
              b("color")`${palette.border}`,
            ]),

            "&::marker": {
              content: '""',
            }
          }}>
            <a href={x} target="_blank" rel="noopener noreferrer">Lien</a>
          </li>)}
        </ul>
      </motion.div>
    </div>
  );
}

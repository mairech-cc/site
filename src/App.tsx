import winnie from "./assets/winnie.gif";
import confettiMp3 from "./assets/sounds/confetti.mp3";

import { useCallback, useEffect, useState } from "react";
import { useConfetti } from "./modules/confetti";
import { WinnieAnimation } from "./modules/winnie";
import { SpinjitzuSpawner } from "./modules/spinjitzu";
import { ActionsHandler } from "./modules/actions/main";
import { useActionsRouter } from "./modules/actions/router";
import { Help } from "./modules/help/main";
import { Discord } from "./modules/discord";
import { Section } from "./modules/section";
import { Title } from "./modules/title";
import { IconInfoCircle, IconUser } from "@tabler/icons-react";
import { LeafletMap } from "./modules/map/main";
import { CPlayer } from "./modules/cplayer/main";
import { Button } from "./modules/button";
import { Link } from "react-router";
import { useDocumentTitle } from "./utils/dom";
import { offset, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { AnimatePresence } from "framer-motion";
import AccountPopover from "./modules/accounts/popover";

function App() {
  const confetti = useConfetti();

  const [winnieEnabled, setWinnieEnabled] = useState(false);
  const [headerClicks, setHeaderClicks] = useState(0);
  const [invokeSpinjitzu, setInvokeSpinjitzu] = useState<null | (() => void)>(null);
  const [help, setHelp] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [discord, setDiscord] = useState(false);
  const [title, setTitle] = useDocumentTitle();

  const { refs: floatingRefs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: accountVisible,
    onOpenChange: setAccountVisible,
    transform: false,
    middleware: [
      offset(10),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  useEffect(() => {
    if (title != "Nejib Mairech") {
      setTitle("Nejib Mairech");
    }
  }, [title, setTitle]);

  const playConfetti = useCallback(() => {
    confetti.addConfetti();
    const audio = new Audio(confettiMp3);
    audio.play();
    audio.addEventListener("ended", () => audio.remove());
    setHeaderClicks(headerClicks + 1);

    if ((headerClicks + 1) % 10 == 0) {
      invokeSpinjitzu!();
    }
  }, [confetti, headerClicks, invokeSpinjitzu]);

  const handler = useActionsRouter(() => ({
    confetti() {
      playConfetti();
    },
    winnie() {
      setWinnieEnabled(v => !v);
    },
    play(file) {
      if (typeof file != "string") {
        return;
      }

      const audio = new Audio(file);
      audio.play();
    },
    playRandom(files) {
      if (!Array.isArray(files) || files.some(x => typeof x != "string")) {
        return;
      }

      this.play(files[Math.floor(Math.random() * files.length)]);
    },
    help() {
      setHelp(v => !v);
      setDiscord(false);
    },
    discord() {
      setHelp(false);
      setDiscord(v => !v);
    }
  }));

  return (
    <ActionsHandler handler={handler}>
      {refs => (
        <>
          {winnieEnabled && <WinnieAnimation src={winnie} />}
          <SpinjitzuSpawner invokeRef={setInvokeSpinjitzu} />
          {help && <Help />}
          {discord && <Discord />}

          <div css={{
            position: "absolute",
              right: "1em",
              top: "1em",
              color: "black",
            display: "flex",
            flexDirection: "row-reverse",
            gap: "1em",

              "@media (prefers-color-scheme: dark)": {
                color: "white",
              },

            "& > span": {
              cursor: "pointer",
            }
          }}>
            <span ref={refs.help}>
            <IconInfoCircle />
          </span>

            <span ref={floatingRefs.setReference} {...getReferenceProps()}>
              <IconUser />
            </span>

            <AnimatePresence>
              {accountVisible && <AccountPopover ref={floatingRefs.setFloating} {...getFloatingProps()} style={floatingStyles} />}
            </AnimatePresence>
          </div>

          <Title ref={refs.title} />

          <p>
            Ce site vous est proposé par <span ref={refs.firstnames}>Juliano</span> et{" "}
            <span ref={refs.firstnames}>Mathias</span>.
          </p>

          <Section title="mairech.cc est maintenant en source ouverte">
            <p>
              <code>mairech.cc</code> est maintenant disponible en source ouverte sur GitHub.
            </p>

            <a href="https://mairech.cc/github" target="_blank">
              <Button>
                Voir
              </Button>
            </a>
          </Section>

          <Section title="2i2d-sin.julman.fr déplacé">
            <p>
              Le contenu de <code>2i2d-sin.julman.fr</code> déménage ici. <Link to="/wiki/">Voir...</Link>
            </p>
          </Section>

          <Section title="Où ?">
            <div
              style={{
                width: "100%",
                maxWidth: 500,
                float: "left",
                margin: "0 2em 1em 0",
              }}
            >
              <LeafletMap />
            </div>

            <p>
              Le lycée Louis Armand à Mulhouse est un lycée général, technologique et professionnel pouvant accueillir
              les élèves de la seconde au BTS, DNMADE ou CPGE ATS. Il propose une large gamme de formations adaptées aux
              aspirations et aux projets des élèves :
            </p>

            <ul>
              <li>
                <strong>Seconde générale et technologique</strong> : une année d’orientation pour acquérir une culture
                générale commune avant d’opter pour un bac général ou technologique.
              </li>

              <li>
                <strong>Bac Français International Britannique</strong> : une formation exigeante pour les élèves
                souhaitant renforcer leur niveau en anglais tout en suivant un programme enrichi en littérature et
                civilisation britannique.
              </li>

              <li>
                <strong>Bac technologique STD2A</strong> : idéal pour les élèves attirés par le design, l’art appliqué
                et la création d’objets.
              </li>

              <li>
                <strong>Bac technologique STI2D</strong> : une formation tournée vers l’innovation technologique,
                l’éco-conception, les systèmes numériques et les énergies durables.
              </li>
            </ul>

            <p>
              Le lycée dispose d’infrastructures modernes et adaptées pour accompagner les élèves dans leurs
              apprentissages et projets professionnels.
            </p>
          </Section>

          <Section title="Programmation en C">
            <CPlayer
              baseFiles={{
                "main.c":
                  "/* Ce programme affiche \"2 + 2 = 4\"\n" +
                  "   et se termine avec le code 0. */\n" +
                  "\n" +
                  "#include <stdio.h>\n" +
                  "#include \"add.h\"\n" +
                  "\n" +
                  "int main()\n" +
                  "{\n"
                  + "  printf(\"2 + 2 = %i\\n\", add(2, 2));\n" +
                  "  return 0;\n}\n",
                "add.h": "#pragma once\n\nextern int add(int, int);\n",
                "add.c": "#include \"add.h\"\n\nint add(int a, int b)\n{\n  return a + b;\n}\n",
              }}
            />
          </Section>
        </>
      )}
    </ActionsHandler>
  );
}

export default App;

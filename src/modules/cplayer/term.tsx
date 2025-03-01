import { Terminal } from "@xterm/xterm";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useWasmerPackage } from "./wasmer";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { initCliLoader } from "./loader";
import { Directory, Wasmer } from "@wasmer/sdk";
import { pipeToXterm } from "./utils";

export function CPlayTerminal({
  working,
  setWorking,
  setDownloadUrl,
  files,
  ref,
}: {
  working: boolean;
  setWorking: Dispatch<SetStateAction<boolean>>;
  setDownloadUrl: Dispatch<SetStateAction<string>>;
  files: Record<string, string>;
  ref: MutableRefObject<Terminal | null>;
}) {
  const [div, setDiv] = useState<HTMLDivElement | null>(null);
  const [term, setTerm] = useState<Terminal | null>(null);
  const cancelLoaderRef = useRef<() => void>();

  const [clang, trigger] = useWasmerPackage("clang/clang");

  useEffect(() => {
    if (ref.current != term) {
      ref.current = term;
    }
  }, [term, ref]);

  useEffect(() => {
    if (div == null) {
      return;
    }

    let term: Terminal | null = null;

    async function loadTerm(a: FontFace[]) {
      if (a.length == 0) {
        document.fonts.load('12px "JetBrains Mono"').then(loadTerm);
        return;
      }

      term = new Terminal({
        fontFamily: '"JetBrains Mono"',
        fontSize: 12,
        cursorBlink: true,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      const webglAddon = new WebglAddon();
      webglAddon.onContextLoss(() => webglAddon.dispose());
      term.loadAddon(webglAddon);
      term.loadAddon(new WebLinksAddon());
      
      term.open(div!);
      fitAddon.fit();
      
      term.write("Prêt.");
      setTerm(term);
    }

    setTimeout(() => {
      loadTerm([]);
    }, 10);
  }, [div, ref]);

  useEffect(() => {
    let stop: (() => void) | null = null;

    if (!working) {
      // Ignoring updates if not working...
      return;
    }

    if (!term) {
      return;
    }

    if (!clang) {
      trigger();
      cancelLoaderRef.current = initCliLoader(term, "Téléchargement du compilateur...");
      return;
    } else {
      cancelLoaderRef.current?.();
      term.write("\r\x1B[2K✅\x1B[32m  Compilateur téléchargé.\x1B[0m\n");
    }

    setTimeout(async () => {
      const start = performance.now();

      const appDir = new Directory();

      for (const [name, content] of Object.entries(files)) {
        await appDir.writeFile(name, content);
      }

      const args = [
        ...Object.keys(files).filter(x => x.endsWith(".c") || x.endsWith(".cpp")),
        "-I.",
        "-o",
        "output.wasm",
      ];

      stop = initCliLoader(term, "Compilation...");

      try {
        const instance = await clang.entrypoint!.run({
          mount: { "/app": appDir },
          cwd: "/app",
          args: args,
        });

        const compilationResults = await instance.wait();
        stop();

        if (compilationResults.ok) {
          const end = performance.now();
          term.write(`\r\x1B[2K✅\x1B[32m  Projet compilé en ${Math.ceil(end - start)}ms.\x1B[0m\n`);
        } else {
          term.write("\r\x1B[2K");
          term.write(`\x1B[90m$ clang ${args.join(" ")}\x1B[0m\n`);
          term.write(compilationResults.stdoutBytes);
          term.write(compilationResults.stderrBytes);
          term.write(`\n\x1B[2K🧨\x1B[32m  Une erreur est survenue, code de sortie ${compilationResults.code}.\x1B[0m\n`);
          setWorking(false);
          return;
        }

        const output = await appDir.readFile("output.wasm");
        term.write(`\x1B[90m$ /output.wasm\x1B[0m\n`);
        const wasm = await Wasmer.fromFile(output);
        const realProc = await wasm.entrypoint!.run();

        const dispose = pipeToXterm(realProc, term);

        const results = await realProc.wait();
        wasm.free();

        dispose.dispose();

        const blob = new Blob([output], { type: "application/wasm" });
        const url = URL.createObjectURL(blob);

        term.write(`\n✅\x1B[32m  Code de sortie: ${results.code}\x1B[0m\n`);
        setDownloadUrl(url);
        setWorking(false);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => {
      if (stop) {
        return stop();
      }
    }
  }, [term, working, cancelLoaderRef, clang, files, setDownloadUrl, setWorking, trigger]);

  return (
    <div
      ref={setDiv}
      css={{
        fontFamily: '"JetBrains Mono"',
        fontSize: "12px",
        width: "100%",
        height: "100%"
      }}
    />
  );
}

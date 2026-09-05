import cLang from "@shikijs/langs/c";
import cppLang from "@shikijs/langs/cpp";
import mdLang from "@shikijs/langs/md";
import jsLang from "@shikijs/langs/js";
import githubDark from "@shikijs/themes/github-dark";
import { Instance } from "@wasmer/sdk";
import { Terminal } from "@xterm/xterm";
import { createJavaScriptRegexEngine } from "shiki";
import { createHighlighterCore } from "shiki/core";

const shiki = await createHighlighterCore({
  langs: [...cLang, ...cppLang, ...mdLang, ...jsLang],
  themes: [githubDark],
  engine: createJavaScriptRegexEngine(),
});

const encoder = new TextEncoder();

export function pipeToXterm(instance: Instance, term: Terminal) {
  const stdin = instance.stdin?.getWriter();

  instance.stdout.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
  instance.stderr.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
  return term.onData(data => stdin?.write(encoder.encode(data)));
}

export { shiki, githubDark };

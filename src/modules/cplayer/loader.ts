import { Terminal } from "@xterm/xterm";

export function initCliLoader(term: Terminal, message: string) {
  const keyframes = ["⢎ ", "⠎⠁", "⠊⠑", "⠈⠱", " ⡱", "⢀⡰", "⢄⡠", "⢆⡀"];
  const speed = 80;
  let index = 0;
  
  const int = window.setInterval(() => {
    term.write("\r\x1B[32m" + keyframes[index] + "\x1B[0m " + message);
    index = (index + 1) % keyframes.length;
  }, speed);

  return () => {
    window.clearInterval(int);
  }
};

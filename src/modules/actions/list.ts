import type { ClickElements, Key } from "./main";

import whipMp3 from "../../assets/whip.mp3";
import drinkingMp3 from "../../assets/drinking.mp3";
import robloxDeathMp3 from "../../assets/roblox-death.mp3";
import minecraftHitMp3 from "../../assets/minecraft-hit.mp3";
import mario64OofMp3 from "../../assets/mario64-oof.mp3";
import ninjagoLowBudgetMp3 from "../../assets/ninjago-low-budget.mp3";
import androidMp3 from "../../assets/android.mp3";
import erikaMp3 from "../../assets/erika.mp3";
import gunMp3 from "../../assets/gun.mp3";
import yameteMp3 from "../../assets/yamete.mp3";
import toothlessMp3 from "../../assets/toothless.mp3";
import weedMp3 from "../../assets/weed.mp3";
import shrekMp3 from "../../assets/shrek.mp3";
import zemmourMp3 from "../../assets/zemmour.mp3";
import chipiMp3 from "../../assets/chipi.mp3";
import phMp3 from "../../assets/ph.mp3";
import boberMp3 from "../../assets/bober.mp3";

export type Action = {
  description: string;
  authors: string[];
} & ({ noAction: true; } | { action: [string, ...unknown[]]; }) & ({
  type: "keys";
  keys: Key[];
} | {
  type: "click";
  element: keyof ClickElements;
});

export const ACTIONS: Record<string, Action> = {
  helpButton: {
    description: "Affiche l'aide — Les sons possibles",
    type: "click",
    element: "help",
    authors: ["Juliano"],
    action: ["help"],
  },
  helpKey: {
    description: "Affiche l'aide — Les sons possibles",
    type: "keys",
    keys: ["Shift+i"],
    authors: ["Juliano"],
    action: ["help"],
  },
  discord: {
    description: "Le Discord",
    type: "keys",
    keys: ["Shift+d"],
    authors: ["Juliano"],
    action: ["discord"],
  },
  wikiSearchButton: {
    description: "Recherche dans les pages de cours",
    type: "click",
    element: "search",
    authors: ["Juliano"],
    action: ["search"]
  },
  wikiSearchKey: {
    description: "Recherche dans les pages de cours",
    type: "keys",
    keys: ["Ctrl+k"],
    authors: ["Juliano"],
    action: ["search"]
  },
  confetti: {
    description: "🎉🎉",
    type: "click",
    element: "title",
    authors: ["Juliano", "Mathias", "Louis"],
    action: ["confetti"],
  },
  names: {
    description: "Des bruits...",
    type: "click",
    element: "firstnames",
    authors: ["Juliano", "Mathias"],
    action: ["playRandom", [
      whipMp3,
      drinkingMp3,
      robloxDeathMp3,
      minecraftHitMp3,
      mario64OofMp3,
      ninjagoLowBudgetMp3,
    ]],
  },
  konami: {
    description: "오빤 강남스타일",
    type: "keys",
    keys: [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ],
    authors: ["Juliano"],
    action: ["winnie"],
  },
  gun: {
    description: "🔫🔫",
    type: "keys",
    keys: ["g"],
    authors: ["Juliano", "Mathias"],
    action: ["play", gunMp3],
  },
  erika: {
    description: "Herms Niel — Erika",
    type: "keys",
    keys: ["h"],
    authors: ["Maxime"],
    action: ["play", erikaMp3],
  },
  android: {
    description: "Samsung",
    type: "keys",
    keys: ["a"],
    authors: ["Juliano"],
    action: ["play", androidMp3],
  },
  yamete: {
    description: "やめてください",
    type: "keys",
    keys: ["y"],
    authors: ["Mathias"],
    action: ["play", yameteMp3],
  },
  toothless: {
    description: "Krokmou, Toothless",
    type: "keys",
    keys: ["t"],
    authors: ["Mathias"],
    action: ["play", toothlessMp3],
  },
  weed: {
    description: "🚬🚬",
    type: "keys",
    keys: ["w"],
    authors: ["Juliano"],
    action: ["play", weedMp3],
  },
  shrek: {
    description: "Somebody wants",
    type: "keys",
    keys: ["s"],
    authors: ["Anthony"],
    action: ["play", shrekMp3],
  },
  zemmour: {
    description: "Éric Zemmour",
    type: "keys",
    keys: ["z"],
    authors: ["Anthony"],
    action: ["play", zemmourMp3],
  },
  chipi: {
    description: "Chipi Chapa",
    type: "keys",
    keys: ["p"],
    authors: ["Louis"],
    action: ["play", chipiMp3],
  },
  ph: {
    description: "😰",
    type: "keys",
    keys: ["Shift+p"],
    authors: ["Mathias"],
    action: ["play", phMp3],
  },
  bober: {
    description: "Bober Curva",
    type: "keys",
    keys: ["b"],
    authors: ["Mathias"],
    action: ["play", boberMp3],
  }
};

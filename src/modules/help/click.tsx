import { memo } from "react";
import { ClickElements } from "../actions/main";

export const ClickElement = memo(({ children }: { children: keyof ClickElements }) => {
  switch (children) {
    case "firstnames":
      return "Cliquer sur « Juliano » ou « Mathias »";

    case "title":
      return "Cliquer sur le titre « Nejib Mairech »";

    case "help":
      return "Cliquer sur l'aide (en haut à droite)";
  }
});

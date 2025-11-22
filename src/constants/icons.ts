import Escape from "@/assets/icons/icon-escape.svg?react";
import Warn from "@/assets/icons/icon-warn.svg?react";
import Correct from "@/assets/icons/icon-correct.svg?react";
import Item from "@/assets/icons/icon-check.svg?react";

export const ICON_COMPONENTS = {
  escape: Escape,
  warn: Warn,
  correct: Correct,
  check: Item,
} as const;

export const ICON_LIST = [Escape, Warn, Correct, Item] as const;

export const ICON_NAME_MAP: Record<string, string> = {
  "0": "escape",
  "1": "warn",
  "2": "correct",
  "3": "check",
};

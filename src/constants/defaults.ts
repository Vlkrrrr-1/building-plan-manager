import type { SubtaskType } from "../db/rxdb";

export const DEFAULT_CHECKLIST: SubtaskType[] = [
  {
    name: "Prepare materials",
    value: "Check inventory",
    icon: "check",
    status: "not_started",
  },
  {
    name: "Safety inspection",
    value: "Verify compliance",
    icon: "warn",
    status: "not_started",
  },
  {
    name: "Complete work",
    value: "Finish task",
    icon: "correct",
    status: "not_started",
  },
];

export const STATUS_COLORS = {
  not_started: "bg-gray-200",
  in_progress: "bg-blue-200",
  blocked: "bg-red-200",
  final_check: "bg-yellow-200",
  done: "bg-green-200",
} as const;

export const STATUS_TRANSITIONS = {
  not_started: "in_progress",
  in_progress: "final_check",
  final_check: "done",
  done: "not_started",
  blocked: "in_progress",
} as const;

export type TaskStatus = keyof typeof STATUS_COLORS;

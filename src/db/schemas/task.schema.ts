export const taskSchema = {
  title: "task schema",
  version: 1,
  description: "Schema for tasks with subtasks and user link",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    userId: { type: "string" },
    imageId: { type: "string" },
    name: { type: "string" },
    title: { type: "string" },
    color: { type: "string" },
    x: { type: "number" },
    y: { type: "number" },
    subtasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          icon: { type: "string" },
          status: {
            type: "string",
            enum: [
              "not_started",
              "in_progress",
              "blocked",
              "final_check",
              "done",
            ],
            default: "not_started",
          },
        },
        required: ["name", "value", "icon"],
      },
      default: [],
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "userId", "name", "createdAt"],
} as const;

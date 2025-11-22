export const userSchema = {
  title: "user schema",
  version: 0,
  description: "Schema users",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "name", "createdAt"],
} as const;

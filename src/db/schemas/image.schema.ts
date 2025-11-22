export const imageSchema = {
  title: "image schema",
  version: 0,
  description: "Schema for building plan images",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    userId: { type: "string" },
    name: { type: "string" },
    imageData: { type: "string" },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "userId", "name", "imageData", "createdAt"],
} as const;

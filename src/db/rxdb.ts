import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
import { userSchema } from "./schemas/user.schema";
import { taskSchema } from "./schemas/task.schema";
import { imageSchema } from "./schemas/image.schema";
import type { RxDatabase, RxCollection } from "rxdb";

addRxPlugin(RxDBMigrationSchemaPlugin);

export type UserDocType = {
  id: string;
  name: string;
  createdAt: string;
};

export type SubtaskType = {
  name: string;
  value: string;
  icon: string;
  status?: "not_started" | "in_progress" | "blocked" | "final_check" | "done";
};

export type ImageDocType = {
  id: string;
  userId: string;
  name: string;
  imageData: string;
  createdAt: string;
};

export type TaskDocType = {
  id: string;
  userId: string;
  imageId?: string;
  name: string;
  title?: string;
  color?: string;
  x?: number;
  y?: number;
  subtasks: SubtaskType[];
  createdAt: string;
};

export type MyCollections = {
  users: RxCollection<UserDocType>;
  tasks: RxCollection<TaskDocType>;
  images: RxCollection<ImageDocType>;
};

export type MyDatabase = RxDatabase<MyCollections>;

let db: MyDatabase | null = null;

export async function initDB(): Promise<MyDatabase> {
  if (db) return db;

  const database = await createRxDatabase<MyCollections>({
    name: "testingdb",
    storage: getRxStorageDexie(),
    multiInstance: false,
  });

  await database.addCollections({
    users: { schema: userSchema },
    tasks: { schema: taskSchema },
    images: { schema: imageSchema },
  });

  db = database;
  return db;
}

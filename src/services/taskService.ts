import type { RxDocument } from "rxdb";
import { initDB, type TaskDocType, type SubtaskType } from "../db/rxdb";
import { nanoid } from "nanoid";

export async function addTaskToUser(
  userId: string,
  name: string,
  options?: {
    title?: string;
    color?: string;
    x?: number;
    y?: number;
    subtasks?: SubtaskType[];
    imageId?: string;
  }
) {
  const db = await initDB();

  const newTask = {
    id: nanoid(),
    userId,
    imageId: options?.imageId,
    name,
    title: options?.title || name,
    color: options?.color || "#34D399",
    x: options?.x,
    y: options?.y,
    subtasks: options?.subtasks || [],
    createdAt: new Date().toISOString(),
  };

  await db.tasks.insert(newTask);
  return newTask;
}

export async function getTasksByUser(
  userId: string
): Promise<RxDocument<TaskDocType>[]> {
  const db = await initDB();

  const tasks = await db.tasks
    .find({
      selector: { userId },
    })
    .exec();

  return tasks;
}

export async function getTasksByImage(
  imageId: string
): Promise<RxDocument<TaskDocType>[]> {
  const db = await initDB();

  const tasks = await db.tasks
    .find({
      selector: { imageId },
    })
    .exec();

  return tasks;
}

export async function deleteTask(taskId: string): Promise<void> {
  const db = await initDB();

  const task = await db.tasks.findOne({ selector: { id: taskId } }).exec();
  if (task) {
    await task.remove();
  }
}

export async function updateTask(
  taskId: string,
  updates: Partial<TaskDocType>
): Promise<void> {
  const db = await initDB();

  const task = await db.tasks.findOne({ selector: { id: taskId } }).exec();
  if (task) {
    await task.patch(updates);
  }
}

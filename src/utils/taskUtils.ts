import type { TaskDocType } from "../db/rxdb";
import { getTasksByImage } from "../services/taskService";
import { COLORS } from "../constants/colors";

export type MarkerData = {
  x: number;
  y: number;
  color: string;
  taskId: string;
  taskName: string;
};

export function getTaskDisplayName(task: TaskDocType): string {
  return task.title || task.name;
}

export function generateInitials(text: string, maxLength = 2): string {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, maxLength)
    .join("")
    .toUpperCase();
}

export function createMarkersFromTasks(tasks: TaskDocType[]): MarkerData[] {
  return tasks
    .filter((t) => t.x !== undefined && t.y !== undefined)
    .map((t) => ({
      x: t.x!,
      y: t.y!,
      color: t.color || COLORS.task.default,
      taskId: t.id,
      taskName: getTaskDisplayName(t),
    }));
}

export async function refreshTasksAndMarkers(
  imageId: string
): Promise<{ tasks: TaskDocType[]; markers: MarkerData[] }> {
  const tasksFromDB = await getTasksByImage(imageId);
  const tasks = tasksFromDB.map((t) => t.toJSON() as TaskDocType);
  const markers = createMarkersFromTasks(tasks);

  return { tasks, markers };
}

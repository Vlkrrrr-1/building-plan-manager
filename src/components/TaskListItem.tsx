import React from "react";
import type { TaskDocType } from "../db/rxdb";
import { getTaskDisplayName, generateInitials } from "../utils/taskUtils";

interface TaskListItemProps {
  task: TaskDocType;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const displayName = getTaskDisplayName(task);
  const initials = generateInitials(displayName);

  return (
    <div className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-4 py-2 items-center rounded-xl shadow-sm transition-colors flex flex-row gap-2 group">
      <div
        className="w-8 h-8 border rounded-md flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: task.color }}
      >
        {initials}
      </div>
      <div className="flex-1">{displayName}</div>
      <button
        className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition-all mr-1"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-all"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default TaskListItem;

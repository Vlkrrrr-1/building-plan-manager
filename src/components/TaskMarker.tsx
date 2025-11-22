import React from "react";

interface TaskMarkerProps {
  x: number;
  y: number;
  color: string;
  taskName: string;
  taskId: string;
  onDragStart?: (taskId: string) => void;
  onDoubleClick?: (taskId: string) => void;
}

const TaskMarker: React.FC<TaskMarkerProps> = ({
  x, y, color, taskName, taskId, onDragStart, onDoubleClick
}) => {
  return (
    <div
      className="absolute group"
      draggable
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", taskId);
        onDragStart?.(taskId);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.(taskId);
      }}
    >
      <div
        className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-move hover:scale-125 transition-transform"
        style={{ backgroundColor: color }}
      />

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          {taskName}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default TaskMarker;

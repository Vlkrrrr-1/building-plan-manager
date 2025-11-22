import React, { useState } from "react";
import { useModalStore } from "../../store/useModalStore";
import AddNewItem from "@/assets/icons/icon-checklist.svg?react";
import Arrow from "@/assets/icons/arrow.svg?react";
import type { SubtaskType } from "../../db/rxdb";
import { ICON_COMPONENTS } from "../../constants/icons";
import { STATUS_COLORS, STATUS_TRANSITIONS } from "../../constants/statuses";
import { COLORS } from "../../constants/colors";

interface MainModalProps {
  subtasks: SubtaskType[];
  editingTask?: import("../../db/rxdb").TaskDocType | null;
  onTaskCreated?: (taskName?: string, color?: string) => void;
  onUpdateSubtask?: (index: number, subtask: SubtaskType) => void;
  onDeleteSubtask?: (index: number) => void;
}

const MainModal: React.FC<MainModalProps> = ({
  subtasks,
  editingTask,
  onTaskCreated,
  onUpdateSubtask,
  onDeleteSubtask,
}) => {
  const { close, setModalMode } = useModalStore();
  const [isOpen, setIsOpen] = useState(true);
  const [taskName, setTaskName] = useState<string>(
    editingTask?.title || editingTask?.name || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    editingTask?.color || COLORS.task.default
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");

  const title = taskName.trim();
  const initials = title
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAddNewItem = () => {
    setModalMode("Items");
  };

  const handleAddNewTask = () => {
    onTaskCreated?.(taskName.trim() || "New Task", selectedColor);
    close();
  };

  const colors = COLORS.task.palette;

  return (
    <div className="flex flex-col max-h-[600px] ">
      {/* Task name input */}
      <div className="flex flex-col pb-4">
        <h2 className="text-lg font-bold px-4 py-3">Task Name</h2>
        <input
          type="text"
          placeholder="Light bulb"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="input border rounded-lg mx-6 px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Color picker */}
      <div className="px-6 py-2">
        <h3 className="text-sm font-semibold mb-2">Select Task Color</h3>
        <div className="flex gap-2 items-center">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColor === color ? "border-black" : "border-white"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200 my-2" />

      {/* Header */}
      <button
        className="flex justify-between items-center px-4 py-3"
        onClick={() => setIsOpen((p) => !p)}
      >
        <span className="text-sm font-semibold">Checklist</span>
        <Arrow
          className={`transition-transform w-4 h-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Main Item */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 border rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: selectedColor }}
          >
            {initials || "?"}
          </div>
          <p className="text-sm font-bold">{title || "Task Name"}</p>
        </div>

        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
          {subtasks.length} {subtasks.length === 1 ? "step" : "steps"}
        </span>
      </div>

      {isOpen && (
        <>
          <hr className="border-gray-100" />

          <div className="flex flex-col gap-3 px-4 py-3 max-h-[200px] overflow-y-auto">
            {subtasks.map((subtask, i) => {
              const IconComponent =
                ICON_COMPONENTS[subtask.icon as keyof typeof ICON_COMPONENTS] ||
                ICON_COMPONENTS.check;
              const status = subtask.status || "not_started";

              if (editingIndex === i) {
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 rounded-md bg-blue-50"
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-sm font-semibold border rounded px-2 py-1"
                      placeholder="Item name"
                    />
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                      placeholder="Item value"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onUpdateSubtask?.(i, {
                            ...subtask,
                            name: editName,
                            value: editValue,
                          });
                          setEditingIndex(null);
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`flex gap-3 items-center p-2 rounded-md ${STATUS_COLORS[status]} transition-colors group`}
                  onClick={() => {
                    const newStatus = STATUS_TRANSITIONS[status] as any;
                    onUpdateSubtask?.(i, { ...subtask, status: newStatus });
                  }}
                >
                  <button className="hover:scale-110 transition-transform">
                    <IconComponent className="w-4 h-4" />
                  </button>
                  <div
                    className="flex-1 cursor-pointer"
                    onDoubleClick={() => {
                      setEditingIndex(i);
                      setEditName(subtask.name);
                      setEditValue(subtask.value);
                    }}
                  >
                    <p className="text-sm font-semibold">{subtask.name}</p>
                    <p className="text-xs text-gray-600">
                      {subtask.value} • {status.replace(/_/g, " ")}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteSubtask?.(i)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs font-bold transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* Add new item */}
      <div
        className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 ml-6 rounded-md"
        onClick={handleAddNewItem}
      >
        <AddNewItem className="w-4 h-4" />
        <span className="text-sm font-bold text-blue-600">Add new item</span>
      </div>
      {/* Add new task / Update task */}
      <div className="flex justify-center">
        <div
          className="flex gap-3 items-center justify-center cursor-pointer hover:bg-gray-50 p-2 rounded-md"
          onClick={handleAddNewTask}
        >
          <AddNewItem className="w-4 h-4" />
          <span className="text-sm font-bold text-blue-600">
            {editingTask ? "Update task" : "Add new task"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainModal;

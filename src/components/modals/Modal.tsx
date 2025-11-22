import React, { useState } from "react";
import { useModalStore } from "../../store/useModalStore";
import MainModal from "./MainModal";
import ModalAddItem from "./ModalAddItem";
import type { SubtaskType, TaskDocType } from "../../db/rxdb";
import { DEFAULT_CHECKLIST } from "../../constants/defaults";

interface ModalProps {
  onTaskCreated?: (
    taskName?: string,
    color?: string,
    subtasks?: SubtaskType[]
  ) => void;
  editingTask?: TaskDocType | null;
  onTaskUpdated?: (taskId: string, updates: Partial<TaskDocType>) => void;
}

const Modal: React.FC<ModalProps> = ({
  onTaskCreated,
  editingTask,
  onTaskUpdated,
}) => {
  const modalMode = useModalStore((state) => state.modalMode);
  const [subtasks, setSubtasks] = useState<SubtaskType[]>([]);

  React.useEffect(() => {
    if (editingTask) {
      setSubtasks(editingTask.subtasks || []);
    } else if (subtasks.length === 0) {
      setSubtasks(DEFAULT_CHECKLIST);
    }
  }, [editingTask]);

  const handleAddSubtask = (subtask: SubtaskType) => {
    setSubtasks((prev) => [...prev, subtask]);
  };

  const handleUpdateSubtask = (index: number, subtask: SubtaskType) => {
    setSubtasks((prev) =>
      prev.map((item, i) => (i === index ? subtask : item))
    );
  };

  const handleDeleteSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  if (modalMode === "Items") {
    return <ModalAddItem onAddSubtask={handleAddSubtask} />;
  }

  return (
    <MainModal
      subtasks={subtasks}
      editingTask={editingTask}
      onTaskCreated={(taskName, color) => {
        if (editingTask) {
          onTaskUpdated?.(editingTask.id, {
            title: taskName,
            name: taskName,
            color: color,
            subtasks: subtasks,
          });
        } else {
          onTaskCreated?.(taskName, color, subtasks);
        }
        setSubtasks([]);
      }}
      onUpdateSubtask={handleUpdateSubtask}
      onDeleteSubtask={handleDeleteSubtask}
    />
  );
};

export default Modal;

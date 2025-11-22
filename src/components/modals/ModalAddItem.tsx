import React, { useState } from "react";
import { useModalStore } from "../../store/useModalStore";
import type { SubtaskType } from "../../db/rxdb";
import AddNewItem from "@/assets/icons/icon-checklist.svg?react";
import { ICON_LIST, ICON_NAME_MAP } from "../../constants/icons";
import { notifications } from "../../utils/notifications";

interface ModalAddItemProps {
  onAddSubtask: (subtask: SubtaskType) => void;
}

const ModalAddItem: React.FC<ModalAddItemProps> = ({ onAddSubtask }) => {
  const { setModalMode } = useModalStore();
  const [itemName, setItemName] = useState<string>("");
  const [itemValue, setItemValue] = useState<string>("");
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);

  const handleAdd = () => {
    if (!itemName.trim()) {
      notifications.error("Please enter item name");
      return;
    }

    const subtask: SubtaskType = {
      name: itemName.trim(),
      value: itemValue.trim(),
      icon: ICON_NAME_MAP[selectedIconIndex.toString()],
      status: "not_started",
    };

    onAddSubtask(subtask);

    setItemName("");
    setItemValue("");
    setSelectedIconIndex(0);
    setModalMode("Main");
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Choose Icon</h2>
        <button
          className="text-gray-500 hover:text-black"
          onClick={() => setModalMode("Main")}
        >
          ✕
        </button>
      </div>

      {/* Icons */}
      <div className="flex justify-between gap-4 px-4">
        {ICON_LIST.map((Icon, idx) => (
          <button
            key={idx}
            className={`p-2 rounded-lg transition ${
              selectedIconIndex === idx ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedIconIndex(idx)}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Item name input */}
      <div>
        <label className="font-semibold px-1">Item name</label>
        <input
          type="text"
          placeholder="Light bulb"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="input w-full border rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Item value input */}
      <div>
        <label className="font-semibold px-1">Item value</label>
        <input
          type="text"
          placeholder="150s"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
          className="input w-full border rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {(() => {
          const Icon = ICON_LIST[selectedIconIndex];
          return <Icon className="w-6 h-6 opacity-60" />;
        })()}
        <div>
          <p className="font-bold text-sm">{itemName || "Item name"}</p>
          <p className="text-xs text-gray-600">{itemValue || "Item value"}</p>
        </div>
      </div>

      {/* Add btn */}
      <button
        className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition w-full"
        onClick={handleAdd}
      >
        <AddNewItem className="w-5 h-5" />
        ADD NEW ITEM
      </button>
    </div>
  );
};

export default ModalAddItem;

import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalMode: "Main" | "Items";
  setModalMode: (mode: "Main" | "Items") => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalMode: "Main",
  setModalMode: (mode) => set({ modalMode: mode }),
  open: () => set({ isOpen: true, modalMode: "Main" }),
  close: () => set({ isOpen: false, modalMode: "Main" }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

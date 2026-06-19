"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIStore {
  // ─── Sidebar ─────────────────────────────────────────────────────────────
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // ─── Modais ──────────────────────────────────────────────────────────────
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // ─── Command Palette ─────────────────────────────────────────────────────
  isCommandOpen: boolean;
  toggleCommand: () => void;
  setCommandOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // ─── Sidebar ───────────────────────────────────────────────────────
        isSidebarOpen: true,
        toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen }), false, "toggleSidebar"),
        setSidebarOpen: (open) => set({ isSidebarOpen: open }, false, "setSidebarOpen"),

        // ─── Modais ────────────────────────────────────────────────────────
        activeModal: null,
        openModal: (id) => set({ activeModal: id }, false, "openModal"),
        closeModal: () => set({ activeModal: null }, false, "closeModal"),

        // ─── Command Palette ───────────────────────────────────────────────
        isCommandOpen: false,
        toggleCommand: () => set((s) => ({ isCommandOpen: !s.isCommandOpen }), false, "toggleCommand"),
        setCommandOpen: (open) => set({ isCommandOpen: open }, false, "setCommandOpen"),
      }),
      {
        name: "ui-store",
        // Persistir apenas o estado do sidebar (preferência do usuário)
        partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
      }
    ),
    { name: "UIStore" }
  )
);

// ─── Seletores otimizados (evitam re-renders desnecessários) ─────────────────
export const useSidebarOpen = () => useUIStore((s) => s.isSidebarOpen);
export const useActiveModal = () => useUIStore((s) => s.activeModal);
export const useCommandOpen = () => useUIStore((s) => s.isCommandOpen);

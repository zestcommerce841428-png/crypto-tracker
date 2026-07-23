"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  vsCurrency: string;
  setVsCurrency: (currency: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      vsCurrency: "usd",
      setVsCurrency: (currency) => set({ vsCurrency: currency }),
    }),
    { name: "crypto-tracker-settings" }
  )
);

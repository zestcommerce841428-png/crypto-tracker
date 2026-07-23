"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PortfolioHolding {
  uid: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  buyPrice: number;
  buyCurrency: string;
  buyDate: string;
  note?: string;
}

interface PortfolioState {
  holdings: PortfolioHolding[];
  addHolding: (holding: Omit<PortfolioHolding, "uid">) => void;
  updateHolding: (uid: string, patch: Partial<PortfolioHolding>) => void;
  removeHolding: (uid: string) => void;
  clear: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (holding) =>
        set((state) => ({
          holdings: [
            ...state.holdings,
            { ...holding, uid: crypto.randomUUID() },
          ],
        })),
      updateHolding: (uid, patch) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.uid === uid ? { ...h, ...patch } : h
          ),
        })),
      removeHolding: (uid) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.uid !== uid),
        })),
      clear: () => set({ holdings: [] }),
    }),
    { name: "crypto-tracker-portfolio" }
  )
);

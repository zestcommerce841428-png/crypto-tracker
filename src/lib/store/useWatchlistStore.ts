"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  coinIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  isWatched: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      coinIds: [],
      add: (id) =>
        set((state) =>
          state.coinIds.includes(id)
            ? state
            : { coinIds: [...state.coinIds, id] }
        ),
      remove: (id) =>
        set((state) => ({ coinIds: state.coinIds.filter((c) => c !== id) })),
      toggle: (id) => {
        const { coinIds } = get();
        if (coinIds.includes(id)) {
          set({ coinIds: coinIds.filter((c) => c !== id) });
        } else {
          set({ coinIds: [...coinIds, id] });
        }
      },
      isWatched: (id) => get().coinIds.includes(id),
    }),
    { name: "crypto-tracker-watchlist" }
  )
);

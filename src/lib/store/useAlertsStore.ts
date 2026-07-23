"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PriceAlert {
  uid: string;
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
}

interface AlertsState {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, "uid" | "triggered">) => void;
  removeAlert: (uid: string) => void;
  markTriggered: (uid: string) => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [...state.alerts, { ...alert, uid: crypto.randomUUID(), triggered: false }],
        })),
      removeAlert: (uid) =>
        set((state) => ({ alerts: state.alerts.filter((a) => a.uid !== uid) })),
      markTriggered: (uid) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.uid === uid ? { ...a, triggered: true } : a)),
        })),
    }),
    { name: "crypto-tracker-alerts" }
  )
);

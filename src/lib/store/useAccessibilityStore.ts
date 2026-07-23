"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ACCENT_COLORS = [
  { id: "blue", label: "Blue", hex: "#3861fb" },
  { id: "indigo", label: "Indigo", hex: "#4f46e5" },
  { id: "purple", label: "Purple", hex: "#8b5cf6" },
  { id: "deepPurple", label: "Deep Purple", hex: "#7c3aed" },
  { id: "pink", label: "Pink", hex: "#ec4899" },
  { id: "red", label: "Red", hex: "#ef4444" },
  { id: "orange", label: "Orange", hex: "#f97316" },
  { id: "amber", label: "Amber", hex: "#f59e0b" },
  { id: "green", label: "Green", hex: "#16a34a" },
  { id: "emerald", label: "Emerald", hex: "#10b981" },
  { id: "teal", label: "Teal", hex: "#14b8a6" },
  { id: "cyan", label: "Cyan", hex: "#06b6d4" },
  { id: "lightBlue", label: "Sky", hex: "#0ea5e9" },
  { id: "brown", label: "Brown", hex: "#92400e" },
] as const;

export type AccentColorId = (typeof ACCENT_COLORS)[number]["id"];

export const DISPLAY_MODES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "high-contrast-light", label: "High Contrast Light" },
  { id: "high-contrast-dark", label: "High Contrast Dark" },
] as const;

export type DisplayMode = (typeof DISPLAY_MODES)[number]["id"];

export type FontScale = "small" | "medium" | "large" | "x-large";
export type LineHeightScale = "normal" | "relaxed" | "loose";
export type LetterSpacingScale = "normal" | "wide" | "wider";
export type CursorSize = "normal" | "large" | "x-large";
export type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "monochromacy";

interface AccessibilityState {
  displayMode: DisplayMode;
  accentColor: AccentColorId;
  fontScale: FontScale;
  lineHeight: LineHeightScale;
  letterSpacing: LetterSpacingScale;
  cursorSize: CursorSize;
  colorblindMode: ColorblindMode;
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  reducedTransparency: boolean;
  enhancedFocusRing: boolean;
  underlineLinks: boolean;
  boldText: boolean;
  ttsEnabled: boolean;
  ttsRate: number;

  setDisplayMode: (v: DisplayMode) => void;
  setAccentColor: (v: AccentColorId) => void;
  setFontScale: (v: FontScale) => void;
  setLineHeight: (v: LineHeightScale) => void;
  setLetterSpacing: (v: LetterSpacingScale) => void;
  setCursorSize: (v: CursorSize) => void;
  setColorblindMode: (v: ColorblindMode) => void;
  toggleDyslexiaFont: () => void;
  toggleReduceMotion: () => void;
  toggleReducedTransparency: () => void;
  toggleEnhancedFocusRing: () => void;
  toggleUnderlineLinks: () => void;
  toggleBoldText: () => void;
  toggleTts: () => void;
  setTtsRate: (v: number) => void;
  resetAll: () => void;
}

const defaults = {
  displayMode: "dark" as DisplayMode,
  accentColor: "blue" as AccentColorId,
  fontScale: "medium" as FontScale,
  lineHeight: "normal" as LineHeightScale,
  letterSpacing: "normal" as LetterSpacingScale,
  cursorSize: "normal" as CursorSize,
  colorblindMode: "none" as ColorblindMode,
  dyslexiaFont: false,
  reduceMotion: false,
  reducedTransparency: false,
  enhancedFocusRing: false,
  underlineLinks: false,
  boldText: false,
  ttsEnabled: false,
  ttsRate: 1,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaults,
      setDisplayMode: (v) => set({ displayMode: v }),
      setAccentColor: (v) => set({ accentColor: v }),
      setFontScale: (v) => set({ fontScale: v }),
      setLineHeight: (v) => set({ lineHeight: v }),
      setLetterSpacing: (v) => set({ letterSpacing: v }),
      setCursorSize: (v) => set({ cursorSize: v }),
      setColorblindMode: (v) => set({ colorblindMode: v }),
      toggleDyslexiaFont: () => set((s) => ({ dyslexiaFont: !s.dyslexiaFont })),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
      toggleReducedTransparency: () => set((s) => ({ reducedTransparency: !s.reducedTransparency })),
      toggleEnhancedFocusRing: () => set((s) => ({ enhancedFocusRing: !s.enhancedFocusRing })),
      toggleUnderlineLinks: () => set((s) => ({ underlineLinks: !s.underlineLinks })),
      toggleBoldText: () => set((s) => ({ boldText: !s.boldText })),
      toggleTts: () => set((s) => ({ ttsEnabled: !s.ttsEnabled })),
      setTtsRate: (v) => set({ ttsRate: v }),
      resetAll: () => set({ ...defaults }),
    }),
    { name: "crypto-tracker-accessibility" }
  )
);

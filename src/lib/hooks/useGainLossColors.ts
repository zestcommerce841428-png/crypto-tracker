"use client";

import { useAccessibilityStore, type ColorblindMode } from "@/lib/store/useAccessibilityStore";

// Standard color-vision-deficiency-safe palettes for financial gain/loss
// indicators. Red/green is the single worst choice for the ~8% of men with
// red-green color blindness (protanopia/deuteranopia) — blue/orange is the
// widely-documented safe substitute. Tritanopia (blue-yellow) keeps
// red/green but shifts toward magenta/teal for extra separation.
const PALETTES: Record<ColorblindMode, { gain: string; loss: string }> = {
  none: { gain: "#16c784", loss: "#ea3943" },
  protanopia: { gain: "#0ea5e9", loss: "#f97316" },
  deuteranopia: { gain: "#0ea5e9", loss: "#f97316" },
  tritanopia: { gain: "#14b8a6", loss: "#d946ef" },
  monochromacy: { gain: "#4b5563", loss: "#111827" },
};

export function useGainLossColors() {
  const colorblindMode = useAccessibilityStore((s) => s.colorblindMode);
  return PALETTES[colorblindMode];
}

export function getGainLossColors(mode: ColorblindMode) {
  return PALETTES[mode];
}

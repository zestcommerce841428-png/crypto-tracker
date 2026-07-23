"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";

export default function ThemeToggle() {
  const displayMode = useAccessibilityStore((s) => s.displayMode);
  const setDisplayMode = useAccessibilityStore((s) => s.setDisplayMode);
  const isDark = displayMode === "dark" || displayMode === "high-contrast-dark";

  const toggle = () => {
    if (displayMode === "dark") setDisplayMode("light");
    else if (displayMode === "light") setDisplayMode("dark");
    else if (displayMode === "high-contrast-dark") setDisplayMode("high-contrast-light");
    else setDisplayMode("high-contrast-dark");
  };

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={toggle} color="inherit" aria-label="Toggle color mode">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { buildTheme } from "./theme";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";

const CURSOR_SIZE_PX: Record<string, number> = {
  normal: 16,
  large: 24,
  "x-large": 32,
};

export default function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    displayMode,
    accentColor,
    fontScale,
    lineHeight,
    letterSpacing,
    dyslexiaFont,
    boldText,
    enhancedFocusRing,
    reduceMotion,
    reducedTransparency,
    underlineLinks,
    cursorSize,
  } = useAccessibilityStore();

  const theme = React.useMemo(
    () =>
      buildTheme({
        displayMode,
        accentColor,
        fontScale,
        lineHeight,
        letterSpacing,
        dyslexiaFont,
        boldText,
        enhancedFocusRing,
      }),
    [displayMode, accentColor, fontScale, lineHeight, letterSpacing, dyslexiaFont, boldText, enhancedFocusRing]
  );

  const cursorPx = CURSOR_SIZE_PX[cursorSize] ?? 16;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*": reduceMotion
            ? { animationDuration: "0.001ms !important", transitionDuration: "0.001ms !important", scrollBehavior: "auto !important" }
            : {},
          ...(reducedTransparency
            ? { "*": { ...(reduceMotion ? { animationDuration: "0.001ms !important", transitionDuration: "0.001ms !important" } : {}), backdropFilter: "none !important" } }
            : {}),
          ...(underlineLinks ? { a: { textDecoration: "underline !important" } } : {}),
          ...(cursorSize !== "normal"
            ? {
                "html, body": {
                  cursor: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='${cursorPx}' height='${cursorPx}' viewBox='0 0 24 24'><path d='M4 2l16 8-7 2-2 7z' fill='black' stroke='white' stroke-width='1.5'/></svg>`
                  )}") 4 4, auto`,
                },
              }
            : {}),
        }}
      />
      {children}
    </ThemeProvider>
  );
}

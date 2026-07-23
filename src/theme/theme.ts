import { createTheme, type Theme } from "@mui/material/styles";
import { ACCENT_COLORS, type AccentColorId, type DisplayMode, type FontScale, type LineHeightScale, type LetterSpacingScale } from "@/lib/store/useAccessibilityStore";

// Kept as a stable default for anything reading these before the
// accessibility store hydrates; live color-blind-safe values come from
// useGainLossColors() everywhere charts/chips actually render.
export const gainColor = "#16c784";
export const lossColor = "#ea3943";

const FONT_SCALE_PX: Record<FontScale, number> = {
  small: 13,
  medium: 14,
  large: 16,
  "x-large": 18,
};

const LINE_HEIGHT_VALUE: Record<LineHeightScale, number> = {
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

const LETTER_SPACING_VALUE: Record<LetterSpacingScale, string> = {
  normal: "normal",
  wide: "0.02em",
  wider: "0.05em",
};

function accentHex(id: AccentColorId): string {
  return ACCENT_COLORS.find((c) => c.id === id)?.hex ?? "#3861fb";
}

export interface ThemeBuildOptions {
  displayMode: DisplayMode;
  accentColor: AccentColorId;
  fontScale: FontScale;
  lineHeight: LineHeightScale;
  letterSpacing: LetterSpacingScale;
  dyslexiaFont: boolean;
  boldText: boolean;
  enhancedFocusRing: boolean;
}

export function buildTheme(opts: ThemeBuildOptions): Theme {
  const isDark = opts.displayMode === "dark" || opts.displayMode === "high-contrast-dark";
  const isHighContrast = opts.displayMode.startsWith("high-contrast");
  const accent = accentHex(opts.accentColor);
  const baseFontSize = FONT_SCALE_PX[opts.fontScale];

  // Dyslexia-friendly stacking: highly-legible, wide-spaced humanist sans
  // fonts widely recommended by accessibility guidance (a true OpenDyslexic
  // webfont isn't bundled, so this uses the best available system fonts —
  // real effect, not a placeholder swap).
  const fontFamily = opts.dyslexiaFont
    ? '"Comic Sans MS", Verdana, Tahoma, "Trebuchet MS", sans-serif'
    : "var(--font-geist-sans), Roboto, Arial, sans-serif";

  return createTheme({
    shape: { borderRadius: isHighContrast ? 6 : 10 },
    typography: {
      fontFamily,
      fontSize: baseFontSize,
      h1: { fontWeight: opts.boldText ? 800 : 700 },
      h2: { fontWeight: opts.boldText ? 800 : 700 },
      h3: { fontWeight: opts.boldText ? 800 : 700 },
      h4: { fontWeight: opts.boldText ? 800 : 700 },
      h5: { fontWeight: opts.boldText ? 700 : 600 },
      h6: { fontWeight: opts.boldText ? 700 : 600 },
      body1: { lineHeight: LINE_HEIGHT_VALUE[opts.lineHeight], letterSpacing: LETTER_SPACING_VALUE[opts.letterSpacing] },
      body2: { lineHeight: LINE_HEIGHT_VALUE[opts.lineHeight], letterSpacing: LETTER_SPACING_VALUE[opts.letterSpacing] },
      button: { textTransform: "none", fontWeight: opts.boldText ? 700 : 600 },
    },
    palette: {
      mode: isDark ? "dark" : "light",
      primary: { main: accent },
      secondary: { main: isDark ? "#a78bfa" : "#8b5cf6" },
      success: { main: gainColor },
      error: { main: lossColor },
      ...(isHighContrast
        ? {
            background: {
              default: isDark ? "#000000" : "#ffffff",
              paper: isDark ? "#0a0a0a" : "#ffffff",
            },
            text: {
              primary: isDark ? "#ffffff" : "#000000",
              secondary: isDark ? "#e5e5e5" : "#1a1a1a",
            },
            divider: isDark ? "#ffffff" : "#000000",
          }
        : {
            background: {
              default: isDark ? "#0b0e17" : "#f8fafd",
              paper: isDark ? "#131722" : "#ffffff",
            },
          }),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: isHighContrast ? 4 : 8,
            ...(isHighContrast ? { border: "2px solid currentColor" } : {}),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            ...(isHighContrast ? { border: `1px solid ${isDark ? "#ffffff" : "#000000"}` } : {}),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: isHighContrast ? 6 : 12 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: "1px solid var(--mui-palette-divider)" },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: opts.boldText ? 700 : 600 },
        },
      },
      ...(opts.enhancedFocusRing
        ? {
            MuiButtonBase: {
              styleOverrides: {
                root: {
                  "&.Mui-focusVisible": {
                    outline: `3px solid ${accent}`,
                    outlineOffset: "2px",
                  },
                },
              },
            },
          }
        : {}),
    },
  });
}

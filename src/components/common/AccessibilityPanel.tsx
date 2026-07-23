"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import {
  useAccessibilityStore,
  ACCENT_COLORS,
  DISPLAY_MODES,
  type AccentColorId,
  type DisplayMode,
  type FontScale,
  type LineHeightScale,
  type LetterSpacingScale,
  type CursorSize,
  type ColorblindMode,
} from "@/lib/store/useAccessibilityStore";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";
import { speakText, isSpeechSupported } from "@/lib/utils/speech";

const COLORBLIND_OPTIONS: { id: ColorblindMode; label: string }[] = [
  { id: "none", label: "Standard (Red / Green)" },
  { id: "protanopia", label: "Protanopia-safe (Blue / Orange)" },
  { id: "deuteranopia", label: "Deuteranopia-safe (Blue / Orange)" },
  { id: "tritanopia", label: "Tritanopia-safe (Teal / Magenta)" },
  { id: "monochromacy", label: "Monochromacy (Grayscale)" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
      {children}
    </Typography>
  );
}

export default function AccessibilityPanel() {
  const [open, setOpen] = React.useState(false);
  const store = useAccessibilityStore();
  const { gain, loss } = useGainLossColors();
  const speechSupported = isSpeechSupported();

  return (
    <>
      <Tooltip title="Accessibility & display settings">
        <IconButton
          onClick={() => setOpen(true)}
          color="inherit"
          aria-label="Open accessibility and display settings"
        >
          <SettingsRoundedIcon />
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: "100vw", sm: 400 }, p: 3 }} role="presentation">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Accessibility & Display
            </Typography>
            <IconButton onClick={() => setOpen(false)} aria-label="Close panel">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <Box>
              <SectionTitle>Display Mode</SectionTitle>
              <ToggleButtonGroup
                value={store.displayMode}
                exclusive
                fullWidth
                orientation="vertical"
                size="small"
                onChange={(_e, v: DisplayMode | null) => v && store.setDisplayMode(v)}
              >
                {DISPLAY_MODES.map((m) => (
                  <ToggleButton key={m.id} value={m.id} sx={{ justifyContent: "flex-start", px: 2 }}>
                    {m.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box>
              <SectionTitle>Accent Color ({ACCENT_COLORS.length} options)</SectionTitle>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {ACCENT_COLORS.map((c) => (
                  <Tooltip title={c.label} key={c.id}>
                    <Box
                      component="button"
                      onClick={() => store.setAccentColor(c.id as AccentColorId)}
                      aria-label={`Accent color ${c.label}`}
                      aria-pressed={store.accentColor === c.id}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: c.hex,
                        border: store.accentColor === c.id ? "3px solid" : "1px solid",
                        borderColor: store.accentColor === c.id ? "text.primary" : "divider",
                        cursor: "pointer",
                        p: 0,
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>

            <Divider />

            <Box>
              <SectionTitle>Font Size</SectionTitle>
              <ToggleButtonGroup
                value={store.fontScale}
                exclusive
                fullWidth
                size="small"
                onChange={(_e, v: FontScale | null) => v && store.setFontScale(v)}
              >
                <ToggleButton value="small">A</ToggleButton>
                <ToggleButton value="medium">A</ToggleButton>
                <ToggleButton value="large">A</ToggleButton>
                <ToggleButton value="x-large">A</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <SectionTitle>Line Height</SectionTitle>
              <ToggleButtonGroup
                value={store.lineHeight}
                exclusive
                fullWidth
                size="small"
                onChange={(_e, v: LineHeightScale | null) => v && store.setLineHeight(v)}
              >
                <ToggleButton value="normal">Normal</ToggleButton>
                <ToggleButton value="relaxed">Relaxed</ToggleButton>
                <ToggleButton value="loose">Loose</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <SectionTitle>Letter Spacing</SectionTitle>
              <ToggleButtonGroup
                value={store.letterSpacing}
                exclusive
                fullWidth
                size="small"
                onChange={(_e, v: LetterSpacingScale | null) => v && store.setLetterSpacing(v)}
              >
                <ToggleButton value="normal">Normal</ToggleButton>
                <ToggleButton value="wide">Wide</ToggleButton>
                <ToggleButton value="wider">Wider</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <FormControlLabel
              control={<Switch checked={store.dyslexiaFont} onChange={store.toggleDyslexiaFont} />}
              label="Dyslexia-friendly font"
            />
            <FormControlLabel
              control={<Switch checked={store.boldText} onChange={store.toggleBoldText} />}
              label="Bold text throughout"
            />

            <Divider />

            <Box>
              <SectionTitle>Color Vision (Gain / Loss Colors)</SectionTitle>
              <ToggleButtonGroup
                value={store.colorblindMode}
                exclusive
                fullWidth
                orientation="vertical"
                size="small"
                onChange={(_e, v: ColorblindMode | null) => v && store.setColorblindMode(v)}
              >
                {COLORBLIND_OPTIONS.map((opt) => (
                  <ToggleButton key={opt.id} value={opt.id} sx={{ justifyContent: "flex-start", px: 2 }}>
                    {opt.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="Gain" size="small" sx={{ bgcolor: gain, color: "#fff", fontWeight: 700 }} />
                <Chip label="Loss" size="small" sx={{ bgcolor: loss, color: "#fff", fontWeight: 700 }} />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <SectionTitle>Motion & Effects</SectionTitle>
              <FormControlLabel
                control={<Switch checked={store.reduceMotion} onChange={store.toggleReduceMotion} />}
                label="Reduce motion & animations"
              />
              <FormControlLabel
                control={<Switch checked={store.reducedTransparency} onChange={store.toggleReducedTransparency} />}
                label="Reduce transparency & blur"
              />
            </Box>

            <Box>
              <SectionTitle>Navigation & Input</SectionTitle>
              <FormControlLabel
                control={<Switch checked={store.enhancedFocusRing} onChange={store.toggleEnhancedFocusRing} />}
                label="Enhanced keyboard focus ring"
              />
              <FormControlLabel
                control={<Switch checked={store.underlineLinks} onChange={store.toggleUnderlineLinks} />}
                label="Always underline links"
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Cursor Size
                </Typography>
                <ToggleButtonGroup
                  value={store.cursorSize}
                  exclusive
                  fullWidth
                  size="small"
                  onChange={(_e, v: CursorSize | null) => v && store.setCursorSize(v)}
                >
                  <ToggleButton value="normal">Normal</ToggleButton>
                  <ToggleButton value="large">Large</ToggleButton>
                  <ToggleButton value="x-large">X-Large</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <Divider />

            <Box>
              <SectionTitle>Speech</SectionTitle>
              <FormControlLabel
                control={<Switch checked={store.ttsEnabled} onChange={store.toggleTts} disabled={!speechSupported} />}
                label="Enable read-aloud buttons on prices"
              />
              {!speechSupported && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Text-to-speech isn&apos;t supported in this browser.
                </Typography>
              )}
              {store.ttsEnabled && speechSupported && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2">Speech Rate: {store.ttsRate.toFixed(1)}x</Typography>
                  <Slider
                    value={store.ttsRate}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onChange={(_e, v) => store.setTtsRate(v as number)}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RecordVoiceOverRoundedIcon />}
                    onClick={() => speakText("This is CryptoTracker's text to speech preview.", store.ttsRate)}
                  >
                    Test voice
                  </Button>
                </Stack>
              )}
            </Box>

            <Divider />

            <Button
              startIcon={<RestartAltRoundedIcon />}
              onClick={store.resetAll}
              variant="outlined"
              color="inherit"
            >
              Reset all to defaults
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

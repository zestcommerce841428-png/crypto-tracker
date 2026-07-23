"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";

const SHOW_UP_THRESHOLD_PX = 320;
const NEAR_BOTTOM_PX = 80;
const NEAR_TOP_PX = 80;

export default function ScrollToTop() {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [docHeight, setDocHeight] = React.useState(0);
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);

  React.useEffect(() => {
    // Native "scroll" fires dozens of times per second during momentum
    // scrolling; calling 3 setState updates on every single one of those
    // events (as this used to) forces that many re-renders per second on
    // every page in the app. Coalescing to one update per animation frame
    // (browsers repaint at most once per frame anyway) fixes the jank
    // without losing any visible responsiveness.
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollTop(top);
      setDocHeight(height);
      setProgress(height > 0 ? (top / height) * 100 : 0);
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const showUp = scrollTop > SHOW_UP_THRESHOLD_PX;
  const showDown = docHeight - scrollTop > NEAR_BOTTOM_PX && docHeight > NEAR_TOP_PX;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (!showUp && !showDown) return null;

  return (
    <Stack
      spacing={1.5}
      sx={{
        position: "fixed",
        bottom: { xs: 76, sm: 24 },
        right: 24,
        zIndex: 1200,
        alignItems: "center",
      }}
    >
      <Zoom in={showUp} unmountOnExit>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={52}
            thickness={3}
            sx={{ position: "absolute", top: -2, left: -2, color: "primary.main", opacity: 0.6 }}
          />
          <Tooltip title="Scroll to top" placement="left">
            <Fab size="medium" color="primary" aria-label="Scroll to top" onClick={scrollToTop}>
              <KeyboardArrowUpRoundedIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      <Zoom in={showDown} unmountOnExit>
        <Tooltip title="Scroll to bottom" placement="left">
          <Fab
            size="small"
            color="default"
            aria-label="Scroll to bottom"
            onClick={scrollToBottom}
            sx={{ opacity: 0.85 }}
          >
            <KeyboardArrowDownRoundedIcon />
          </Fab>
        </Tooltip>
      </Zoom>
    </Stack>
  );
}

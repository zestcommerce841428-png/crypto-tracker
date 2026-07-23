"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function getTimeParts(targetMs: number) {
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function HalvingCountdown({ targetMs }: { targetMs: number }) {
  const [time, setTime] = React.useState(() => getTimeParts(targetMs));

  React.useEffect(() => {
    const interval = setInterval(() => setTime(getTimeParts(targetMs)), 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {units.map((unit) => (
          <Grid size={3} key={unit.label} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {String(unit.value).padStart(2, "0")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {unit.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

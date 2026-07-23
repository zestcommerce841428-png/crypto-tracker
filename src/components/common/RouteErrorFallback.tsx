"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Link from "next/link";

// Shared UI for every route segment's error.tsx. Next.js requires each
// error boundary to be a Client Component and calls it with the thrown
// error plus a `reset()` that retries rendering the segment in place —
// most failures here are transient (a rate-limited upstream API call),
// so a retry genuinely can succeed without a full page reload.
export default function RouteErrorFallback({
  error,
  reset,
  label = "this page",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  label?: string;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(`Error rendering ${label}:`, error);
  }, [error, label]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <ErrorOutlineRoundedIcon sx={{ fontSize: 56, color: "error.main" }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Something went wrong loading {label}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is usually temporary — often a busy upstream data source. Give it another try.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" startIcon={<RefreshRoundedIcon />} onClick={reset}>
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outlined">Back to Dashboard</Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}

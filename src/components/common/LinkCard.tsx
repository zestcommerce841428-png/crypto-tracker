"use client";

import Link from "next/link";
import Paper, { type PaperProps } from "@mui/material/Paper";

export default function LinkCard({
  href,
  children,
  sx,
  ...rest
}: PaperProps & { href: string }) {
  return (
    <Paper
      component={Link}
      href={href}
      variant="outlined"
      sx={{ p: 2, display: "block", textDecoration: "none", "&:hover": { borderColor: "primary.main" }, ...sx }}
      {...rest}
    >
      {children}
    </Paper>
  );
}

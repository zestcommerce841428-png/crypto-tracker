"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Link from "next/link";

export default function CoinAboutSection({
  name,
  descriptionHtml,
  categories,
  links,
}: {
  name: string;
  descriptionHtml: string;
  categories: string[];
  links: { label: string; href: string }[];
}) {
  const [expanded, setExpanded] = React.useState(false);

  if (!descriptionHtml) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        About {name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        component="div"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 5,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          "& a": { color: "primary.main" },
        }}
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
      <Button size="small" onClick={() => setExpanded((v) => !v)} sx={{ mt: 0.5 }}>
        {expanded ? "Show less" : "Read more"}
      </Button>

      {categories.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {categories.map((c) => (
            <Chip key={c} label={c} size="small" variant="outlined" />
          ))}
        </Stack>
      )}

      {links.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {links.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

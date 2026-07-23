"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { footerNavGroups, exploreNavGroups } from "@/lib/nav";

export default function SitemapLinks() {
  const groups = [...footerNavGroups, ...exploreNavGroups];

  return (
    <Grid container spacing={4}>
      {groups.map((group) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={group.label}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {group.label}
          </Typography>
          <Stack spacing={0.75}>
            {group.items.map((item) => (
              <Typography
                key={item.href}
                component={Link}
                href={item.href}
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "text.primary" } }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

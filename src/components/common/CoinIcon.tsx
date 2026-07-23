"use client";

import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";

// Optimized replacement for MUI's <Avatar src=...>: MUI Avatar renders a
// plain unoptimized <img>, so coin/exchange/NFT logos never got resized,
// re-encoded (WebP/AVIF), or lazy-loaded by Next's image pipeline. This
// wraps next/image with the same circular-avatar look, with a graceful
// fallback (first letter of the name) if the icon URL 404s.
export default function CoinIcon({
  src,
  alt,
  size = 24,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  size?: number;
  priority?: boolean;
}) {
  const [errored, setErrored] = React.useState(false);

  if (!src || errored) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          bgcolor: "action.selected",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.45,
          fontWeight: 700,
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        {alt.charAt(0).toUpperCase()}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "cover" }}
        priority={priority}
        onError={() => setErrored(true)}
        unoptimized={!src.startsWith("https://coin-images.coingecko.com") && !src.startsWith("https://assets.coingecko.com")}
      />
    </Box>
  );
}

"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import XBrandIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const PLATFORMS = [
  {
    id: "twitter",
    label: "Share on X",
    icon: XBrandIcon,
    urlFor: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "telegram",
    label: "Share on Telegram",
    icon: TelegramIcon,
    urlFor: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    icon: WhatsAppIcon,
    urlFor: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    icon: RedditIcon,
    urlFor: (url: string, text: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    icon: FacebookIcon,
    urlFor: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    icon: LinkedInIcon,
    urlFor: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
] as const;

export default function ShareButton({
  url,
  title,
  size = "small",
}: {
  /** Path or absolute URL to share; defaults to the current page. */
  url?: string;
  title: string;
  size?: "small" | "medium";
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = React.useState("");
  const [shortening, setShortening] = React.useState(false);
  const [shortenerUnavailable, setShortenerUnavailable] = React.useState(false);

  const getShareUrl = () => {
    if (url) return new URL(url, window.location.origin).toString();
    return window.location.href;
  };

  const handleOpen = async (e: React.MouseEvent<HTMLElement>) => {
    const shareUrl = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to the menu
      }
    }
    setAnchor(e.currentTarget);
  };

  const handleClose = () => setAnchor(null);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setSnackbar("Link copied to clipboard");
    handleClose();
  };

  const handleShortLink = async () => {
    setShortening(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: getShareUrl() }),
      });
      if (!res.ok) {
        setShortenerUnavailable(true);
        setSnackbar("Short links aren't available right now");
        return;
      }
      const data = await res.json();
      await navigator.clipboard.writeText(data.shortUrl);
      setSnackbar(`Short link copied: ${data.shortUrl}`);
    } catch {
      setSnackbar("Failed to create short link");
    } finally {
      setShortening(false);
      handleClose();
    }
  };

  const handlePlatformShare = (urlFor: (url: string, text: string) => string) => {
    const shareUrl = getShareUrl();
    window.open(urlFor(shareUrl, title), "_blank", "noopener,noreferrer,width=600,height=500");
    handleClose();
  };

  return (
    <>
      <Tooltip title="Share">
        <IconButton size={size} onClick={handleOpen} aria-label="Share">
          <ShareRoundedIcon fontSize={size} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <LinkRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy link</ListItemText>
        </MenuItem>
        {!shortenerUnavailable && (
          <MenuItem onClick={handleShortLink} disabled={shortening}>
            <ListItemIcon>
              <ContentCopyRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{shortening ? "Creating short link…" : "Copy short link"}</ListItemText>
          </MenuItem>
        )}
        <Divider />
        {PLATFORMS.map((p) => (
          <MenuItem key={p.id} onClick={() => handlePlatformShare(p.urlFor)}>
            <ListItemIcon>
              <p.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{p.label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(getShareUrl())}`;
            handleClose();
          }}
        >
          <ListItemIcon>
            <EmailRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share via Email</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar("")}
        message={snackbar}
      />
    </>
  );
}

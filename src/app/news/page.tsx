import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { timeAgo } from "@/lib/utils/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crypto News — Latest Cryptocurrency & Blockchain Headlines",
  description: "Stay up to date with the latest cryptocurrency, blockchain and Web3 news headlines.",
  alternates: { canonical: "/news" },
};

interface NewsItem {
  id: string;
  title: string;
  url: string;
  body: string;
  source: string;
  published_on: number;
  imageurl?: string;
  categories?: string;
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.Data ?? [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto News
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Latest headlines from across the cryptocurrency industry.
        </Typography>
      </Stack>

      {news.length === 0 ? (
        <Alert severity="info">News feed is temporarily unavailable. Please check back soon.</Alert>
      ) : (
        <Grid container spacing={2}>
          {news.slice(0, 30).map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Paper
                component="a"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{ p: 2, display: "block", height: "100%", "&:hover": { borderColor: "primary.main" } }}
              >
                {item.imageurl && (
                  <Box
                    component="img"
                    src={item.imageurl}
                    alt=""
                    sx={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 1, mb: 1.5 }}
                  />
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  {item.body}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip label={item.source} size="small" variant="outlined" />
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(item.published_on * 1000)}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

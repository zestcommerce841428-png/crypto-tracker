import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Crypto Fear & Greed Index — Market Sentiment Gauge",
  description:
    "Track the current crypto market sentiment with the Fear & Greed Index, updated daily.",
  alternates: { canonical: "/fear-greed-index" },
};

interface FngResponse {
  data: Array<{ value: string; value_classification: string; timestamp: string }>;
}

function classificationColor(label: string) {
  const map: Record<string, string> = {
    "Extreme Fear": "#ea3943",
    Fear: "#f0973b",
    Neutral: "#f3d42f",
    Greed: "#93d900",
    "Extreme Greed": "#16c784",
  };
  return map[label] ?? "#8b5cf6";
}

async function getFearGreed(): Promise<FngResponse | null> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=10", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function FearGreedPage() {
  const fng = await getFearGreed();
  const latest = fng?.data?.[0];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Fear & Greed Index
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A daily gauge of overall crypto market sentiment, from Extreme Fear to Extreme Greed.
        </Typography>
      </Stack>

      {latest ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              border: `10px solid ${classificationColor(latest.value_classification)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              mx: "auto",
              mb: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {latest.value}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: classificationColor(latest.value_classification) }}>
            {latest.value_classification}
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <Typography color="text.secondary">Sentiment data is temporarily unavailable.</Typography>
        </Paper>
      )}

      {fng?.data && fng.data.length > 1 && (
        <Grid container spacing={2}>
          {fng.data.slice(1, 10).map((entry) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={entry.timestamp}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: classificationColor(entry.value_classification) }}>
                  {entry.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(Number(entry.timestamp) * 1000).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

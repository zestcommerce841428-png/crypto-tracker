import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import HalvingCountdown from "./HalvingCountdown";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Bitcoin Halving Countdown — Next Halving Date & Block",
  description:
    "Live countdown to the next Bitcoin halving, based on the current block height and average block time.",
  alternates: { canonical: "/halving" },
};

const HALVING_INTERVAL = 210000;

async function getBlockHeight(): Promise<number | null> {
  try {
    const res = await fetch("https://mempool.space/api/blocks/tip/height", {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return Number(text);
  } catch {
    return null;
  }
}

export default async function HalvingPage() {
  const height = await getBlockHeight();
  const nextHalvingBlock = height ? Math.ceil((height + 1) / HALVING_INTERVAL) * HALVING_INTERVAL : null;
  const blocksRemaining = height && nextHalvingBlock ? nextHalvingBlock - height : null;
  const estimatedMs = blocksRemaining ? Date.now() + blocksRemaining * 10 * 60 * 1000 : null;
  const currentEpoch = height ? Math.floor(height / HALVING_INTERVAL) : null;
  const currentReward = currentEpoch !== null ? 50 / 2 ** currentEpoch : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Bitcoin Halving Countdown
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Estimated based on current block height and a 10-minute average block time.
        </Typography>
      </Stack>

      {estimatedMs ? (
        <HalvingCountdown targetMs={estimatedMs} />
      ) : (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Block data is temporarily unavailable.</Typography>
        </Paper>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">Current Block</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{height?.toLocaleString() ?? "—"}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">Next Halving Block</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{nextHalvingBlock?.toLocaleString() ?? "—"}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">Blocks Remaining</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{blocksRemaining?.toLocaleString() ?? "—"}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">Current Reward</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{currentReward ?? "—"} BTC</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

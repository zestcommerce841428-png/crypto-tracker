import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

export const dynamic = "force-dynamic";
export const revalidate = 20;

export const metadata: Metadata = {
  title: "Ethereum Gas Tracker — Live Gas Prices (Gwei)",
  description: "Track live Ethereum network gas prices in Gwei for slow, average and fast transactions.",
  alternates: { canonical: "/gas-tracker" },
};

interface EtherscanGasResult {
  status: string;
  result?: {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
  };
}

async function getGasPrices(): Promise<EtherscanGasResult["result"] | null> {
  try {
    const res = await fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle", {
      next: { revalidate: 20 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data: EtherscanGasResult = await res.json();
    return data.status === "1" ? data.result ?? null : null;
  } catch {
    return null;
  }
}

export default async function GasTrackerPage() {
  const gas = await getGasPrices();

  const tiers = gas
    ? [
        { label: "Slow", value: gas.SafeGasPrice, color: "text.secondary" },
        { label: "Average", value: gas.ProposeGasPrice, color: "warning.main" },
        { label: "Fast", value: gas.FastGasPrice, color: "success.main" },
      ]
    : [];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Ethereum Gas Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live gas prices on the Ethereum mainnet, updated every 20 seconds.
        </Typography>
      </Stack>

      {gas ? (
        <Grid container spacing={2}>
          {tiers.map((tier) => (
            <Grid size={{ xs: 12, sm: 4 }} key={tier.label}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {tier.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: tier.color }}>
                  {tier.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Gwei
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">Gas price data is temporarily unavailable.</Alert>
      )}
    </Container>
  );
}

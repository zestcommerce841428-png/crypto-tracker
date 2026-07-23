import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { BLOCKCHAIN_NETWORKS } from "@/lib/data/popularCoins";
import { getAssetPlatforms } from "@/lib/api/coingecko";
import LinkCard from "@/components/common/LinkCard";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blockchain Networks — Coins by Ecosystem & Supported Chains",
  description:
    "Explore cryptocurrencies grouped by blockchain network, and browse every chain CoinGecko supports for contract-address token lookups.",
  alternates: { canonical: "/platforms" },
};

export default async function PlatformsPage() {
  const platforms = await getAssetPlatforms().catch(() => []);
  // chain_identifier is only populated for EVM chains — non-EVM platforms
  // (Solana, Bitcoin-based chains, etc.) legitimately have it as null, so
  // filtering on that would wrongly exclude real, valid platforms.
  const named = platforms.filter((p) => p.name);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Blockchain Networks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse tokens and coins by the blockchain ecosystem they belong to.
        </Typography>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {BLOCKCHAIN_NETWORKS.map((network) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={network.categoryId}>
            <LinkCard href={`/categories/${network.categoryId}`}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {network.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View top {network.name} ecosystem coins
              </Typography>
            </LinkCard>
          </Grid>
        ))}
      </Grid>

      {named.length > 0 && (
        <>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              All Supported Chains ({named.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Every network CoinGecko supports for contract-address token lookups — use any of
              these with the{" "}
              <Typography component="a" href="/token-lookup" color="primary.main">
                Token Lookup tool
              </Typography>
              .
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {named.slice(0, 200).map((p) => {
                const suffix = p.shortname || p.chain_identifier;
                return (
                  <Chip
                    key={p.id}
                    label={suffix ? `${p.name} (${suffix})` : p.name}
                    size="small"
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          </Paper>
        </>
      )}
    </Container>
  );
}

import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getCategories } from "@/lib/api/coingecko";
import { formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import LinkCard from "@/components/common/LinkCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crypto Categories — Browse Coins by Sector",
  description:
    "Explore cryptocurrencies grouped by category: DeFi, NFT, Layer 1, Layer 2, gaming, AI, meme coins and more, ranked by market cap.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Categories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse the market by sector and narrative.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {categories
          .filter((c) => c.market_cap)
          .map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <LinkCard href={`/categories/${category.id}`}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                  {category.name}
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCompactNumber(category.market_cap, "usd")}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    24h Change
                  </Typography>
                  <PriceChangeChip value={category.market_cap_change_24h} />
                </Stack>
              </LinkCard>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

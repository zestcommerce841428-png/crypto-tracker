import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getMarkets, getCategories } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 180;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${formatCategoryName(id)} Coins — Prices & Market Cap`,
    description: `Live prices, market cap and 24h volume for the top ${formatCategoryName(id)} cryptocurrencies.`,
    alternates: { canonical: `/categories/${id}` },
  };
}

function formatCategoryName(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [coins, categories] = await Promise.all([
    getMarkets({ category: id, perPage: 100, page: 1 }),
    getCategories().catch(() => []),
  ]);

  const category = categories.find((c) => c.id === id);

  if (coins.length === 0 && !category) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {category?.name ?? formatCategoryName(id)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top cryptocurrencies in the {category?.name?.toLowerCase() ?? formatCategoryName(id).toLowerCase()} category.
        </Typography>
      </Stack>
      <CoinMarketsTable coins={coins} />
    </Container>
  );
}

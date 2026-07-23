import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { getMarkets, getCoinsList } from "@/lib/api/coingecko";
import { formatCurrency, CURRENCY_LABELS, VS_CURRENCIES } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import CoinPriceChart from "@/components/charts/CoinPriceChart";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

const AMOUNTS = [0.01, 0.1, 1, 5, 10, 50, 100, 1000];

function isFiat(code: string): code is (typeof VS_CURRENCIES)[number] {
  return (VS_CURRENCIES as readonly string[]).includes(code);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ from: string; to: string }>;
}): Promise<Metadata> {
  const { from, to } = await params;
  const title = `Convert ${from.toUpperCase()} to ${to.toUpperCase()} — Live Price Calculator`;
  const description = `Live ${from} to ${to.toUpperCase()} conversion rate and price calculator, updated in real time.`;
  return {
    title,
    description,
    alternates: { canonical: `/convert/${from}/${to}` },
  };
}

export default async function ConvertPage({
  params,
}: {
  params: Promise<{ from: string; to: string }>;
}) {
  const { from, to } = await params;

  const toCurrency = to.toLowerCase();
  if (!isFiat(toCurrency)) {
    notFound();
  }

  const [coins, allCoins] = await Promise.all([
    getMarkets({ ids: [from], vsCurrency: toCurrency, sparkline: false }),
    getCoinsList().catch(() => []),
  ]);

  const coin = coins[0];
  const coinMeta = allCoins.find((c) => c.id === from);

  if (!coin && !coinMeta) {
    notFound();
  }

  const price = coin?.current_price ?? 0;
  const name = coin?.name ?? coinMeta?.name ?? from;
  const symbol = coin?.symbol ?? coinMeta?.symbol ?? from;
  const currencyLabel = CURRENCY_LABELS[toCurrency] ?? toCurrency.toUpperCase();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {name} to {toCurrency.toUpperCase()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live {name} ({symbol.toUpperCase()}) price in {currencyLabel} ({toCurrency.toUpperCase()}), updated every minute.
          </Typography>
        </Stack>

        {coin && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar src={coin.image} sx={{ width: 40, height: 40 }} />
              <Stack>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  1 {symbol.toUpperCase()} = {formatCurrency(price, toCurrency)}
                </Typography>
                <PriceChangeChip value={coin.price_change_percentage_24h} />
              </Stack>
            </Stack>
            <CoinPriceChart coinId={from} vsCurrency={toCurrency} />
          </Paper>
        )}

        {coin && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Quick Conversion Table
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{symbol.toUpperCase()}</TableCell>
                  <TableCell align="right">{toCurrency.toUpperCase()}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AMOUNTS.map((amount) => (
                  <TableRow key={amount}>
                    <TableCell>{amount}</TableCell>
                    <TableCell align="right">{formatCurrency(amount * price, toCurrency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Button href={`/coin/${from}`} variant="outlined" sx={{ alignSelf: "flex-start" }}>
          View full {name} stats
        </Button>
      </Stack>
    </Container>
  );
}

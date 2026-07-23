import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { getExchanges } from "@/lib/api/coingecko";
import { formatCompactNumber } from "@/lib/utils/format";
import LinkTableRow from "@/components/common/LinkTableRow";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Top Crypto Exchanges — Ranked by Trust Score & Volume",
  description:
    "Compare the top cryptocurrency exchanges by trust score, trading volume, and year established.",
  alternates: { canonical: "/exchanges" },
};

export default async function ExchangesPage() {
  const exchanges = await getExchanges(1, 150);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Cryptocurrency Exchanges
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ranked by CoinGecko trust score and normalized 24h trading volume.
        </Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell align="right">Trust Score</TableCell>
              <TableCell align="right">24h Volume (BTC)</TableCell>
              <TableCell align="right">Established</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exchanges.map((ex, i) => (
              <LinkTableRow key={ex.id} href={`/exchanges/${ex.id}`}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={ex.image} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ex.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{ex.trust_score ?? "—"}/10</TableCell>
                <TableCell align="right">{formatCompactNumber(ex.trade_volume_24h_btc)}</TableCell>
                <TableCell align="right">{ex.year_established ?? "—"}</TableCell>
              </LinkTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

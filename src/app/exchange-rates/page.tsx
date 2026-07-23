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
import Chip from "@mui/material/Chip";
import { getExchangeRates } from "@/lib/api/coingecko";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Bitcoin Exchange Rates — BTC to World Currencies & Metals",
  description:
    "Live Bitcoin-denominated exchange rates across world fiat currencies and precious metals, sourced directly from CoinGecko.",
  alternates: { canonical: "/exchange-rates" },
};

export default async function ExchangeRatesPage() {
  const data = await getExchangeRates();
  const rates = Object.entries(data.rates ?? {});
  const fiat = rates.filter(([, r]) => r.type === "fiat");
  const crypto = rates.filter(([, r]) => r.type === "crypto");
  const metal = rates.filter(([, r]) => r.type === "commodity");

  const sections = [
    { label: "Fiat Currencies", rows: fiat },
    { label: "Precious Metals", rows: metal },
    { label: "Other Cryptocurrencies", rows: crypto },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Bitcoin Exchange Rates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          1 BTC valued across world currencies, precious metals, and other cryptocurrencies.
        </Typography>
      </Stack>

      {sections.map(
        (section) =>
          section.rows.length > 0 && (
            <Stack spacing={1} key={section.label} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {section.label}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Currency</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell align="right">1 BTC =</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {section.rows.map(([code, rate]) => (
                      <TableRow key={code} hover>
                        <TableCell>{rate.name}</TableCell>
                        <TableCell>
                          <Chip label={code.toUpperCase()} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          {rate.value.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
                          {rate.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )
      )}
    </Container>
  );
}

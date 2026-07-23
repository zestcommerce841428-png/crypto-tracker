import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Chip from "@mui/material/Chip";
import { getCompanyTreasury } from "@/lib/api/coingecko";
import { formatCompactNumber, formatCurrency } from "@/lib/utils/format";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Public Company Bitcoin & Ethereum Treasury Holdings",
  description:
    "Track which publicly traded companies hold Bitcoin and Ethereum on their balance sheets, ranked by total holdings and current value.",
  alternates: { canonical: "/treasury" },
};

export default async function TreasuryPage() {
  const [btc, eth] = await Promise.all([
    getCompanyTreasury("bitcoin").catch(() => null),
    getCompanyTreasury("ethereum").catch(() => null),
  ]);

  const sections = [
    { label: "Bitcoin", symbol: "BTC", data: btc },
    { label: "Ethereum", symbol: "ETH", data: eth },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Public Company Crypto Treasuries
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Publicly traded companies holding Bitcoin or Ethereum on their balance sheet.
        </Typography>
      </Stack>

      {sections.map(
        (section) =>
          section.data && (
            <Stack spacing={1.5} key={section.label} sx={{ mb: 4 }}>
              <Stack direction="row" spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {section.label} Holders
                </Typography>
                <Chip label={`${section.data.companies.length} companies`} size="small" />
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Holdings</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatCompactNumber(section.data.total_holdings)} {section.symbol}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Value</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatCompactNumber(section.data.total_value_usd, "usd")}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">% of Supply</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {section.data.market_cap_dominance?.toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell align="right">Holdings</TableCell>
                      <TableCell align="right">Current Value</TableCell>
                      <TableCell align="right">% Supply</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {section.data.companies.slice(0, 25).map((company) => (
                      <TableRow key={company.name} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{company.name}</TableCell>
                        <TableCell>{company.country}</TableCell>
                        <TableCell align="right">
                          {company.total_holdings.toLocaleString()} {section.symbol}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(company.total_current_value_usd, "usd")}
                        </TableCell>
                        <TableCell align="right">
                          {company.percentage_of_total_supply?.toFixed(3)}%
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

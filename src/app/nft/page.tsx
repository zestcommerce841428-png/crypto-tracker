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
import { getNftsList } from "@/lib/api/coingecko";
import LinkTableRow from "@/components/common/LinkTableRow";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Top NFT Collections — Rankings by Market Cap",
  description: "Browse top NFT collections tracked by CoinGecko, ranked by market cap.",
  alternates: { canonical: "/nft" },
};

export default async function NftPage() {
  const nfts = await getNftsList(1, 100);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          NFT Collections
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ranked by market cap across supported blockchains.
        </Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Chain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nfts.map((nft, i) => (
              <LinkTableRow key={nft.id} href={`/nft/${nft.id}`}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {nft.name}
                  </Typography>
                </TableCell>
                <TableCell>{nft.symbol?.toUpperCase()}</TableCell>
                <TableCell>
                  <Chip label={nft.asset_platform_id} size="small" variant="outlined" />
                </TableCell>
              </LinkTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

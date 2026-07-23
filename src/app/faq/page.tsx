import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — CryptoTracker",
  description: "Answers to common questions about using CryptoTracker: data sources, accuracy, privacy and features.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "Where does the price data come from?",
    a: "Live prices, market caps and charts come from CoinGecko's public API, with Binance's public API supplementing live ticker data for supported pairs.",
  },
  {
    q: "How often is the data updated?",
    a: "Market data typically refreshes every 45–60 seconds. Coin detail pages refresh roughly every 90 seconds.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. CryptoTracker requires no sign-up. Your watchlist, portfolio and alerts are stored locally in your browser.",
  },
  {
    q: "Is my portfolio data private?",
    a: "Yes. Portfolio holdings are stored only in your browser's local storage and are never sent to our servers.",
  },
  {
    q: "Is this financial advice?",
    a: "No. CryptoTracker is an informational tool only. Nothing on this site constitutes financial advice. See our Disclaimer.",
  },
  {
    q: "Why is a coin's price slightly different from another site?",
    a: "Prices can vary slightly between sources and exchanges due to different data refresh intervals and aggregation methods.",
  },
];

export default function FaqPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Frequently Asked Questions
        </Typography>
      </Stack>
      <Stack spacing={1}>
        {faqs.map((faq) => (
          <Accordion key={faq.q} variant="outlined" disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}

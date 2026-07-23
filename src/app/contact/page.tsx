import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export const metadata: Metadata = {
  title: "Contact Us — CryptoTracker",
  description: "Get in touch with the CryptoTracker team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Have feedback, found a bug, or want to suggest a feature? We&apos;d love to hear from
          you.
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            support@cryptotracker.example.com
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}

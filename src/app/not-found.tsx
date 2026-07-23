import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <SearchOffRoundedIcon sx={{ fontSize: 64, color: "text.secondary" }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The page or coin you&apos;re looking for doesn&apos;t exist or may have been moved.
        </Typography>
        <Link href="/">
          <Button variant="contained">Back to Dashboard</Button>
        </Link>
      </Stack>
    </Container>
  );
}

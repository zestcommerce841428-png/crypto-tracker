import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function CoinDetailLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={56} height={56} />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={32} />
            <Skeleton variant="text" width={160} height={40} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" height={360} />
        <Skeleton variant="rounded" height={240} />
        <Skeleton variant="rounded" height={200} />
      </Stack>
    </Container>
  );
}

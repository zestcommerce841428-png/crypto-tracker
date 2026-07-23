import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function ExchangesLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width={320} height={48} />
        <Skeleton variant="text" width={280} height={24} />
        <Skeleton variant="rounded" height={520} />
      </Stack>
    </Container>
  );
}

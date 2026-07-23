import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function StatCard({
  label,
  value,
  sub,
  subColor,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
          {icon}
          <Typography variant="body2">{label}</Typography>
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {sub && (
          <Box>
            <Typography variant="caption" sx={{ color: subColor ?? "text.secondary", fontWeight: 600 }}>
              {sub}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

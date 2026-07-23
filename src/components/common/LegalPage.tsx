import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function LegalPage({
  title,
  updatedAt,
  sections,
}: {
  title: string;
  updatedAt: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {updatedAt}
          </Typography>
        </Stack>
        {sections.map((section) => (
          <Stack spacing={1} key={section.heading}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {section.heading}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {section.body}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}

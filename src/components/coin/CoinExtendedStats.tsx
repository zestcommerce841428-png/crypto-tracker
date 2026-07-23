import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import GitHubIcon from "@mui/icons-material/GitHub";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import type { CoinDetail } from "@/lib/types/coin";
import { formatCompactNumber, formatPercent, formatDate } from "@/lib/utils/format";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      {icon}
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Stack>
  );
}

export default function CoinExtendedStats({ coin }: { coin: CoinDetail }) {
  const md = coin.market_data;
  const dev = coin.developer_data;
  const community = coin.community_data;
  const sentimentUp = coin.sentiment_votes_up_percentage;
  const sentimentDown = coin.sentiment_votes_down_percentage;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <SectionHeader icon={<TrendingUpRoundedIcon fontSize="small" color="primary" />} title="Extended Performance" />
          <Divider sx={{ mb: 0.5 }} />
          <Row label="14 Day Change" value={formatPercent(md.price_change_percentage_14d)} />
          <Row label="30 Day Change" value={formatPercent(md.price_change_percentage_30d)} />
          <Row label="60 Day Change" value={formatPercent(md.price_change_percentage_60d)} />
          <Row label="200 Day Change" value={formatPercent(md.price_change_percentage_200d)} />
          <Row label="1 Year Change" value={formatPercent(md.price_change_percentage_1y)} />
          <Row label="CoinGecko Rank" value={`#${coin.coingecko_rank ?? "—"}`} />
          <Row label="Genesis Date" value={coin.genesis_date ? formatDate(coin.genesis_date) : "Unknown"} />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <SectionHeader icon={<SentimentSatisfiedRoundedIcon fontSize="small" color="primary" />} title="Community Sentiment" />
          <Divider sx={{ mb: 1 }} />
          {sentimentUp !== null && sentimentUp !== undefined ? (
            <>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  {sentimentUp.toFixed(0)}% Bullish
                </Typography>
                <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                  {sentimentDown?.toFixed(0)}% Bearish
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={sentimentUp}
                color="success"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              No sentiment data available yet.
            </Typography>
          )}
          <Row label="Twitter Followers" value={formatCompactNumber(community.twitter_followers)} />
          <Row label="Reddit Subscribers" value={formatCompactNumber(community.reddit_subscribers)} />
          <Row label="Telegram Users" value={formatCompactNumber(community.telegram_channel_user_count)} />
        </Paper>
      </Grid>

      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <SectionHeader icon={<GitHubIcon fontSize="small" color="primary" />} title="Developer Activity" />
          <Divider sx={{ mb: 0.5 }} />
          <Grid container spacing={1}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Stars" value={dev.stars?.toLocaleString() ?? "—"} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Forks" value={dev.forks?.toLocaleString() ?? "—"} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Subscribers" value={dev.subscribers?.toLocaleString() ?? "—"} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Contributors" value={dev.pull_request_contributors?.toLocaleString() ?? "—"} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Open Issues" value={dev.total_issues?.toLocaleString() ?? "—"} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <Row label="Closed Issues" value={dev.closed_issues?.toLocaleString() ?? "—"} />
            </Grid>
          </Grid>
          <Row label="Commits (last 4 weeks)" value={dev.commit_count_4_weeks?.toLocaleString() ?? "—"} />
          <Row label="Merged Pull Requests" value={dev.pull_requests_merged?.toLocaleString() ?? "—"} />
        </Paper>
      </Grid>
    </Grid>
  );
}

import {
  Box,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  useTheme,
  Paper,
  ListItemText,
} from "@mui/material";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";

interface CommonWidgetLayoutProps {
  title: string;
  chipText: string;
  chipColor: string;
  chipBgColor: string;
  loading?: boolean;
  onOpenDrawer: () => void;
  priorityData: {
    high: number;
    medium: number;
    low: number;
  };
  priorityColors: {
    high: { bg: string; color: string };
    medium: { bg: string; color: string };
    low: { bg: string; color: string };
  };
  children?: React.ReactNode;
}

const CommonWidgetLayout = ({
  title,
  chipText,
  chipColor,
  chipBgColor,
  loading = false,
  onOpenDrawer,
  priorityData,
  priorityColors,
  children,
}: CommonWidgetLayoutProps) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper elevation={3} sx={{ borderRadius: theme.shape.borderRadius, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ p: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading {title.toLowerCase()}...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2.5,
        background: 
          theme.palette.background.paper,
        p: 0,
        position: "relative",
      }}
    >
      {/* Header section with title, chip, and arrow */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "16px 24px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          onClick={onOpenDrawer}
          sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
        >
          <Chip
            label={chipText}
            size="small"
            sx={{
              backgroundColor: chipBgColor,
              color: chipColor,
              fontWeight: 600,
              borderRadius: "6px",
              px: 1,
              py: 0.25,
            }}
          />
          <ArrowForwardIosIcon
            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
          />
        </Stack>
      </Box>

      
      <CardContent sx={{ p: "24px", "&:last-child": { pb: "24px" } }}>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: priorityColors.high.bg,
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                  boxShadow: `0 0 8px 0 ${priorityColors.high.bg}`,
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={onOpenDrawer}
            >
              <Typography
                variant="h4"
                color={priorityColors.high.color}
                fontWeight={700}
              >
                {priorityData.high}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                High
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: priorityColors.medium.bg,
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                  boxShadow: `0 0 8px 0 ${priorityColors.medium.bg}`,
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={onOpenDrawer}
            >
              <Typography
                variant="h4"
                color={priorityColors.medium.color}
                fontWeight={700}
              >
                {priorityData.medium}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Medium
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: priorityColors.low.bg,
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                  boxShadow: `0 0 8px 0 ${priorityColors.low.bg}`,
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={onOpenDrawer}
            >
              <Typography
                variant="h4"
                color={priorityColors.low.color}
                fontWeight={700}
              >
                {priorityData.low}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Low
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Click to review text */}
        <Box textAlign="center" sx={{ mt: 2, mb: 2 }}>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary"
                sx={{
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={onOpenDrawer}
              >
                Click to review and approve items
              </Typography>
            }
          />
        </Box>

        {/* Custom content for each widget */}
        {children}
      </CardContent>
    </Paper>
  );
};

export default CommonWidgetLayout;
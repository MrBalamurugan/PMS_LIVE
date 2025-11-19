import {
  Grid,
  Stack,
  Typography,
  Paper,
  LinearProgress,
  Box,
  Chip,
  useTheme,
} from "@mui/material";

import {
  ProjectTwoTone,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { CorporateFare, Shield } from "@mui/icons-material";

interface SummaryWidgetsProps {
  metrics: {
    branches: number;
    projects: number;
    users: number;
    roles: number;
  };
  loading?: boolean;
}

interface MetricCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  iconBg: string;
  chipBg: string;
  icon: React.ReactNode;
  type: "branches" | "projects" | "users" | "roles";
  change: number;
  extra?: string;
}

const SummaryWidgets = ({ metrics, loading = false }: SummaryWidgetsProps) => {
  const theme = useTheme();

  const colorMap = {
    branches: {
      main: "#2E6FEF", //text
      bg: "#F2F7FF", //card
      iconBg: "#DDEBFF", // icon back
    },

    projects: {
      main: "#21C15C",
      bg: "#EDFFF4",
      iconBg: "#CEFFE0",
    },
    users: {
      main: "#A44FF5",
      bg: "#FBF6FF",
      iconBg: "#EBD6FF",
    },
    roles: {
      main: "#F66D14",
      bg: "#FFF6F0",
      iconBg: "#FFE5D3",
    },
  };

  // Define metrics with updated color logic
  const metricCards: MetricCard[] = [
    {
      title: "Total Branches",
      value: 24,
      color: colorMap.branches.main,
      bgColor: colorMap.branches.bg,
      iconBg: colorMap.branches.iconBg, // Use iconBg for chip background as well
      chipBg: colorMap.branches.iconBg, // Chip Background uses the same pastel shade as the icon container
      icon: (
        <CorporateFare
          style={{ fontSize: 24, color: colorMap.branches.main }}
        />
      ),
      type: "branches",
      change: 2,
      extra: "",
    },
    {
      title: "Active Projects",
      value: 142,
      color: colorMap.projects.main,
      bgColor: colorMap.projects.bg,
      iconBg: colorMap.projects.iconBg,
      chipBg: colorMap.projects.iconBg,
      icon: (
        <ProjectTwoTone
          twoToneColor={colorMap.projects.main}
          style={{ fontSize: 24 }}
        />
      ),
      type: "projects",
      change: 12,
      extra: "+12 new this month",
    },
    {
      title: "System Users",
      value: 856,
      color: colorMap.users.main,
      bgColor: colorMap.users.bg,
      iconBg: colorMap.users.iconBg,
      chipBg: colorMap.users.iconBg,
      icon: (
        <TeamOutlined style={{ fontSize: 24, color: colorMap.users.main }} />
      ),
      type: "users",
      change: 23,
      extra: "+23 joined this month",
    },
    {
      title: "User Roles",
      value: 8,
      color: colorMap.roles.main,
      bgColor: colorMap.roles.bg,
      iconBg: colorMap.roles.iconBg,
      chipBg: colorMap.roles.iconBg,
      icon: <Shield style={{ fontSize: 24, color: colorMap.roles.main }} />,
      type: "roles",
      change: 0,
      extra: "Active role types",
    },
  ];

  if (loading) {
    return (
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Box sx={{ p: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading widgets...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {metricCards.map((metric, index) => {
        const colors = colorMap[metric.type];

        const chipTextColor = colors.main;

        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                borderRadius: 3,
                p: 2.5,

                backgroundColor: colors.bg,
                boxShadow: theme.shadows[3],
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  cursor: "pointer",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              {/* TOP SECTION: Icon (Rounded) and Change Chip */}
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                {/* Icon Container (Rounded) */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%", // Perfectly circular
                    backgroundColor: colors.iconBg, // Light pastel background for icon
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border:
                      metric.type === "roles"
                        ? `0px solid ${colors.main}`
                        : "none",
                  }}
                >
                  {metric.icon}
                </Box>

                {/* Change Chip (Right) - Unified Colors */}
                {!loading && (
                  <Chip
                    size="small"
                    label={
                      metric.change === 0
                        ? "No change"
                        : `${Math.abs(metric.change)}%`
                    }
                    icon={
                      metric.change > 0 ? (
                        <RiseOutlined style={{ fontSize: "0.7rem" }} />
                      ) : metric.change < 0 ? (
                        <FallOutlined style={{ fontSize: "0.7rem" }} />
                      ) : undefined
                    }
                    sx={{
                      borderRadius: 1.5,
                      height: 24,
                      // Chip Background uses the same color as the icon container
                      backgroundColor: colors.iconBg,
                      // Chip Text/Icon uses the main metric color
                      color: chipTextColor,
                      fontWeight: 600,
                      "& .anticon": { color: chipTextColor },

                      ...(metric.change === 0 && {
                        color: theme.palette.text.secondary, // Gray text for no change
                        backgroundColor: colors.iconBg, // Keep light background
                      }),
                      "& .anticon-rise-outlined, & .anticon-fall-outlined": {
                        display: metric.change === 0 ? "none" : "inline-flex",
                      },
                    }}
                  />
                )}
              </Stack>

              <Box color={chipTextColor}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {metric.title}
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                  fontSize: "2.125rem",
                  color: colors.main,
                }}
              >
                {metric.value.toLocaleString()}
              </Typography>

              {/* BOTTOM SECTION: Extra Info / Active/Inactive Detail */}
              {metric.type === "branches" ? (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.main, fontWeight: 500 }}
                  >
                    Active: {metrics.branches - 2}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.error.main, fontWeight: 500 }}
                  >
                    Inactive: 2
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: "block",
                    color: colors.main,
                    fontWeight: 500,
                  }}
                >
                  {metric.extra}
                </Typography>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SummaryWidgets;

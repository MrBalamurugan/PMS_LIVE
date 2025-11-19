// src/components/dashboard/charts/RoleDistributionChart.tsx

// material-ui
import {
  Box,
  CardContent,
  useTheme,
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";

// apexcharts
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

// types
interface RoleDistributionData {
  role: string;
  count: number;
}

interface RoleDistributionChartProps {
  loading?: boolean;
}

// mock data - Keeping the updated colors from the previous iteration
const mockRoleData: RoleDistributionData[] = [
  { role: "Developer", count: 45 },
  { role: "Viewer", count: 32 },
  { role: "Manager", count: 25 },
  { role: "Analyst", count: 18 },
  { role: "Support", count: 15 },
  { role: "Admin", count: 12 },
  { role: "Guest", count: 8 },
];

// ==============================|| ROLE DISTRIBUTION CHART ||============================== //

const RoleDistributionChart = ({
  loading = false,
}: RoleDistributionChartProps) => {
  const theme = useTheme();
  const roleData: RoleDistributionData[] = mockRoleData;

  const getChartOptions = (): ApexOptions => {
    const isDark = theme.palette.mode === "dark";

    const paletteColors = [
      "#7ac1f8ff",
      "#afafafff",
      "#7af8a8ff",
      "#f8df7aff",
      "#ff8989ff",
      "#95effbff",

      "#dbdbdbff",
    ];

    return {
      chart: {
        type: "pie",
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      colors: paletteColors.slice(0, roleData.length),
      labels: roleData.map((item) => item.role),
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"],
        },
      },

      legend: {
        show: true,
        position: "bottom",
      },

      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (value: number) => `${value} users`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "45%",
            labels: {
              show: true,
              total: {
                show: false,
              },
            },
          },
        },
      },
    };
  };

  const getChartSeries = () => {
    return roleData.map((item) => item.count);
  };

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          borderRadius: theme.shape.borderRadius,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Active Users by Role
        </Typography>
        <Box
          sx={{
            p: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading active users...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: theme.shape.borderRadius,
        background: theme.palette.background.paper,
        p: 2,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: "16px 16px 0 16px" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Active Users by Role
        </Typography>
      </Box>

      <CardContent
        sx={{
          p: 2,
          "&:last-child": { pb: 2 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Chart
            options={getChartOptions()}
            series={getChartSeries()}
            type="pie"
            height={300}
          />
        </Box>
      </CardContent>
    </Paper>
  );
};

export default RoleDistributionChart;

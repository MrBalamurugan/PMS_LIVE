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

interface BranchStatusChartProps {
  loading?: boolean;
}

const chartData = [20, 12];

const useBranchStatusChartOptions = (): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      type: "bar",

      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },

    colors: ["success.dark", "error.dark"],
    xaxis: {
      categories: ["Active", "Inactive"],
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
      },
    },

    yaxis: {
      min: 0,
      max: 24,
      tickAmount: 4,
      labels: {
        formatter: function (val: number) {
          return Math.floor(val).toString();
        },
        style: {
          colors: theme.palette.text.primary,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadiusApplication: "end",
        borderRadius: 6,

        colors: {
          ranges: [
            { from: 0, to: 30, color: "#7af8a8ff" },
            { from: 0, to: 16, color: "#f99595ff" },
          ],
        },
      },
    },

    grid: {
      show: true,
      borderColor: theme.palette.secondary.light,
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    tooltip: {
      enabled: true,
    },
    legend: {
      show: false,
    },
  };
};

const series = [
  {
    name: "Branches",
    data: chartData,
  },
];

const BranchStatusChart = ({ loading = false }: BranchStatusChartProps) => {
  const theme = useTheme();
  const options = useBranchStatusChartOptions();

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
          Branch Status
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
            Loading branch status...
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
          Branch Status
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
          <Chart options={options} series={series} type="bar" height="100%" />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
          }}
        >
          {/* Active Chip */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#EDFFF4",
              borderRadius: "4px",
              px: 2,
              py: 0.5,
            }}
          >
            <Typography
              component="span"
              variant="h3"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              {chartData[0]}
            </Typography>
            <Typography
              component="span"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              Active
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFECEC",
              px: 2,
              py: 0.5,
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            <Typography
              component="span"
              variant="h3"
              sx={{
                color: theme.palette.error.main,
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              {chartData[1]}
            </Typography>

            <Typography
              component="span"
              sx={{
                color: "#F66D14",
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              Inactive
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Paper>
  );
};

export default BranchStatusChart;

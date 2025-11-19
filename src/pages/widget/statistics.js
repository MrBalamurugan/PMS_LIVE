// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";

// project imports
import ReportCard from "components/cards/statistics/ReportCard";

// assets
import {
  BarChartOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

// ===========================|| WIDGET - STATISTICS ||=========================== //

const WidgetStatistics = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={3} sm={6}>
        <ReportCard
          primary="$30200"
          secondary="All Earnings"
          color={theme.palette.secondary.main}
          iconPrimary={BarChartOutlined}
        />
      </Grid>
      <Grid item xs={12} lg={3} sm={6}>
        <ReportCard
          primary="145"
          secondary="Task"
          color={theme.palette.error.main}
          iconPrimary={CalendarOutlined}
        />
      </Grid>
      <Grid item xs={12} lg={3} sm={6}>
        <ReportCard
          primary="290+"
          secondary="Page Views"
          color={theme.palette.success.dark}
          iconPrimary={FileTextOutlined}
        />
      </Grid>
      <Grid item xs={12} lg={3} sm={6}>
        <ReportCard
          primary="500"
          secondary="Downloads"
          color={theme.palette.primary.main}
          iconPrimary={DownloadOutlined}
        />
      </Grid>
    </Grid>
  );
};

export default WidgetStatistics;

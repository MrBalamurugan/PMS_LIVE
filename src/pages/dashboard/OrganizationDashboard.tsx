// src/pages/SettingsDashboard.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Badge,
  CircularProgress,
} from "@mui/material";

import {
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  NotificationsActive as NotificationIcon,
} from "@mui/icons-material";

// project import
import SummaryWidgets from "./SummaryWidgets";
import LoginLogs from "./LoginLogsWidget";
import ComplianceAlerts from "./Drawers/CompilanceAlerts";
import PendingApprovals from "./Drawers/PendingApprovals";
import RecentActivities from "./Drawers/RecentActivities";
import BranchStatusChart from "./BranchStatusChart";
import RoleDistributionChart from "./RoleDistributionChart";
//import DashboardCustomization from "./DashboardCustomization";

// types
interface DashboardMetrics {
  branches: number;
  projects: number;
  users: number;
  roles: number;
  pendingApprovals: number;
}

interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

// mock data
const mockMetrics: DashboardMetrics = {
  branches: 24,
  projects: 142,
  users: 856,
  roles: 8,
  pendingApprovals: 12,
};

const initialWidgets: WidgetConfig[] = [
  { id: "summary", title: "Organization Overview", visible: true, order: 0 },
  { id: "roleChart", title: "Role Distribution", visible: true, order: 1 },
  { id: "branchStatus", title: "Branch Status", visible: true, order: 2 },
  { id: "alerts", title: "Compliance Alerts", visible: true, order: 3 },
  { id: "approvals", title: "Pending Approvals", visible: true, order: 4 },
  { id: "activities", title: "Recent Activities", visible: true, order: 5 },
];

// ==============================|| SETTINGS DASHBOARD ||============================== //

const OrganizationDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [loading, setLoading] = useState(true);
  const widgets: WidgetConfig[] = initialWidgets;
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [recentActivitiesDrawerOpen, setRecentActivitiesDrawerOpen] =
    useState(false);
  const [recentActivitiesLoading, setRecentActivitiesLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 800);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  const handleExport = (_format: "pdf" | "excel") => {
    // console.log(`Exporting as ${format}`);
    setExportAnchorEl(null);
  };

  const handleOpenRecentActivities = () => {
    setRecentActivitiesDrawerOpen(true);

    setRecentActivitiesLoading(true);
    setTimeout(() => {
      setRecentActivitiesLoading(false);
    }, 1500);
  };

  const handleCloseRecentActivities = () => {
    setRecentActivitiesDrawerOpen(false);
  };

  const visibleWidgets = widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  const renderWidgets = () => (
    <>
      {widgets.find((w) => w.id === "summary" && w.visible) && (
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}>
            <SummaryWidgets metrics={metrics} loading={loading} />
          </Box>
        </Grid>
      )}

      {/* FIRST ROW: Role Distribution,Branch Status, Login logs */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="stretch">
          {widgets.find((w) => w.id === "roleChart" && w.visible) && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <RoleDistributionChart loading={loading} />
              </Box>
            </Grid>
          )}

          {widgets.find((w) => w.id === "branchStatus" && w.visible) && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <BranchStatusChart loading={loading} />
              </Box>
            </Grid>
          )}

          {/* Login Logs */}
          {widgets.find((w) => w.id === "activities" && w.visible) && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <LoginLogs loading={loading} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* SECOND ROW: Compliance +  Approvals */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {widgets.find((w) => w.id === "alerts" && w.visible) && (
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <ComplianceAlerts loading={loading} />
              </Box>
            </Grid>
          )}

          {widgets.find((w) => w.id === "approvals" && w.visible) && (
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <PendingApprovals loading={loading} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      <Box
        sx={{
          maxHeight: "74vh",
          overflowY: "auto",
          pr: 1, // small padding to prevent scrollbar overlap
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#a8a8a8ff",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#9e9e9e",
          },
        }}
      >
        <Grid container rowSpacing={{ xs: 2, md: 4 }} columnSpacing={2}>
          {/* Header */}
          <Grid item xs={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Box sx={{ mb: { xs: 0.75, sm: 0 } }}>
                <Typography variant="h4" fontWeight={600}>
                  Organization Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time metrics and activity insights
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  justifyContent: { xs: "space-between", sm: "flex-end" },
                  flexWrap: "nowrap",
                  alignItems: "center",
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: "100%",
                  mt: { xs: 0.25, sm: 0 },
                  px: { xs: 2, sm: 0 },
                }}
              >
                <Button
                  sx={{ boxShadow: 1, minWidth: 96 }}
                  color="secondary"
                  variant="outlined"
                  onClick={handleRefresh}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} thickness={5} />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  disabled={loading}
                >
                  Refresh
                </Button>

                <Button
                  sx={{ boxShadow: 1, minWidth: 96 }}
                  color="secondary"
                  variant="outlined"
                  onClick={(e) => setExportAnchorEl(e.currentTarget)}
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>

                <Button
                  sx={{
                    boxShadow: 1,
                    transition: "all 0.3s ease",
                    minWidth: 120,
                  }}
                  color="secondary"
                  variant="outlined"
                  onClick={handleOpenRecentActivities}
                  startIcon={<NotificationIcon />}
                >
                  <Badge badgeContent={10} color="error">
                    Notifications
                  </Badge>
                </Button>
              </Stack>

              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={() => setExportAnchorEl(null)}
              >
                <MenuItem onClick={() => handleExport("pdf")}>
                  Export as PDF
                </MenuItem>
                <MenuItem onClick={() => handleExport("excel")}>
                  Export as Excel
                </MenuItem>
              </Menu>
            </Stack>
          </Grid>

          {/* Render Dashboard */}
          {renderWidgets()}

          {/* Empty State */}
          {visibleWidgets.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <SettingsIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6">No Widgets Visible</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Customize dashboard to add widgets
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* RECENT ACTIVITIES DRAWER */}
        <RecentActivities
          open={recentActivitiesDrawerOpen}
          onClose={handleCloseRecentActivities}
          loading={recentActivitiesLoading}
        />
      </Box>
    </>
  );
};

export default OrganizationDashboard;

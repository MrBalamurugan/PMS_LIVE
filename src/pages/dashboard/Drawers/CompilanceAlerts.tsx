import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  List,
  Stack,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  LinearProgress,
  useTheme,
  Drawer,
  Card,
  Avatar,
} from "@mui/material";
import {
  WarningAmber as WarningIcon,
  CheckCircleOutlineRounded as CheckCircleIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  RadioButtonChecked,
} from "@mui/icons-material";

import CommonWidgetLayout from "../CommonWidgetLayout";

// ==============================|| INTERFACES ||============================== //
interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  projectName: string;
  branchName: string;
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  priority: "high" | "medium" | "low";
  status: "active" | "resolved";
  resolvedBy?: string;
  resolvedAt?: string;
  documentUrl?: string;
}

interface ComplianceAlertsProps {
  loading?: boolean;
}

// ==============================|| MOCK DATA ||============================== //
const mockAlerts: ComplianceAlert[] = [
  {
    id: "1",
    title: "Insurance Certificate Expiring",
    description: "Action Required",
    projectName: "Skyline Towers",
    branchName: "Dubai HQ",
    documentType: "Insurance Certificate",
    expiryDate: "30/01/2025",
    daysUntilExpiry: 15,
    priority: "high",
    status: "active",
  },
  {
    id: "2",
    title: "Business License Renewal",
    description: "Action Required",
    projectName: "Business Bay Heights",
    branchName: "Abu Dhabi Office",
    documentType: "Business License",
    expiryDate: "07/02/2025",
    daysUntilExpiry: 23,
    priority: "medium",
    status: "active",
  },
  {
    id: "3",
    title: "Safety Compliance Certificate",
    description: "Action Required",
    projectName: "Palm Residency",
    branchName: "Sharjah Office",
    documentType: "Safety Certificate",
    expiryDate: "14/02/2025",
    daysUntilExpiry: 45,
    priority: "low",
    status: "active",
  },
  {
    id: "4",
    title: "Tax Compliance Document",
    description: "Document Expired",
    projectName: "Marina Heights",
    branchName: "Dubai HQ",
    documentType: "Tax Filing",
    expiryDate: "15/01/2025",
    daysUntilExpiry: -1,
    priority: "high",
    status: "active",
  },
  {
    id: "5",
    title: "Environmental Permit",
    description: "Resolved",
    projectName: "Warehouse Facility",
    branchName: "South Region",
    documentType: "Environmental Permit",
    expiryDate: "2024-01-20",
    daysUntilExpiry: 0,
    priority: "high",
    status: "resolved",
    resolvedBy: "Admin User",
    resolvedAt: "2024-01-18",
  },
];

// ==============================|| COMPONENT ||============================== //
const ComplianceAlerts = ({ loading = false }: ComplianceAlertsProps) => {
  const theme = useTheme();
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(mockAlerts);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(
    null
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const priorityStyles = {
    high: {
      bg: theme.palette.mode === "dark" ? theme.palette.error.dark : "#FFECEC",
      color: theme.palette.error.main,
    },
    medium: {
      bg:
        theme.palette.mode === "dark"
          ? theme.palette.warning.dark
          : "#fffbd1ff",
      color: theme.palette.warning.main,
    },
    low: {
      bg:
        theme.palette.mode === "dark" ? theme.palette.primary.dark : "#F2F7FF",
      color: theme.palette.primary.main,
    },
    resolved: {
      bg:
        theme.palette.mode === "dark"
          ? theme.palette.success.dark
          : theme.palette.success.light,
      color: theme.palette.success.main,
    },
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  // Priority data for common layout
  const priorityData = {
    high: activeAlerts.filter((a) => a.priority === "high").length,
    medium: activeAlerts.filter((a) => a.priority === "medium").length,
    low: activeAlerts.filter((a) => a.priority === "low").length,
  };

  // Helper functions (getPriorityIcon, getStatusChipColors, getStatusChipLabel remain the same)
  const getPriorityIcon = (
    priority: "high" | "medium" | "low",
    status: "active" | "resolved"
  ) => {
    if (status === "resolved") {
      return <CheckCircleIcon sx={{ color: priorityStyles.resolved.color }} />;
    }
    const { color } = priorityStyles[priority];
    return <WarningIcon sx={{ color }} />;
  };

  const getIconColors = (days: number) => {
    if (days <= 15)
      return { bg: priorityStyles.high.bg, color: priorityStyles.high.color };

    if (days <= 29)
      return {
        bg: priorityStyles.medium.bg,
        color: priorityStyles.medium.color,
      };
    return { bg: priorityStyles.low.bg, color: priorityStyles.low.color };
  };

  const getStatusChipColors = (days: number) => {
    if (days <= 15)
      return { bg: priorityStyles.high.bg, color: priorityStyles.high.color };
    // if (days <= 15) return { bg: priorityStyles.high.bg, color: priorityStyles.high.color };
    // if (days <= 30) return { bg: priorityStyles.medium.bg, color: priorityStyles.medium.color };
    return { bg: priorityStyles.medium.bg, color: priorityStyles.medium.color };
  };

  const getStatusChipLabel = (days: number) => {
    if (days < 0) return "Expired";
    return `${days} days left`;
  };

  const handleUploadClick = (alert: ComplianceAlert) => {
    setSelectedAlert(alert);
    setUploadDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlert) return;

    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedAlerts = alerts.map((alert) =>
      alert.id === selectedAlert.id
        ? {
            ...alert,
            status: "resolved" as const,
            resolvedBy: "Current User",
            resolvedAt: new Date().toISOString().split("T")[0],
            documentUrl: uploadFile
              ? URL.createObjectURL(uploadFile)
              : undefined,
          }
        : alert
    );

    setAlerts(updatedAlerts);
    setUploading(false);
    setUploadDialogOpen(false);
    setSelectedAlert(null);
    setUploadFile(null);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      <CommonWidgetLayout
        title="Compliance Alerts"
        chipText={`${activeAlerts.length} Active`}
        chipColor={priorityStyles.high.color}
        chipBgColor={priorityStyles.high.bg}
        loading={loading}
        onOpenDrawer={handleOpenDrawer}
        priorityData={priorityData}
        priorityColors={priorityStyles}
      >
        {activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 2 }}
          >
            No active compliance alerts
          </Typography>
        )}
      </CommonWidgetLayout>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 560 },
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {/* Drawer content remains the same */}
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Compliance Alerts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeAlerts.length} expiring documents
                </Typography>
              </Box>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: theme.palette.text.primary }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <List sx={{ p: 0 }}>
              {activeAlerts.map((alert) => {
                const statusChip = getStatusChipColors(alert.daysUntilExpiry);
                const priorityIcon = getPriorityIcon(
                  alert.priority,
                  alert.status
                );
                const iconBg = getIconColors(alert.daysUntilExpiry);

                return (
                  <Card
                    key={alert.id}
                    elevation={0}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      border: "2px solid " + theme.palette.grey[200],
                    }}
                  >
                    {/* Card content remains the same */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: iconBg.bg }}>
                          {priorityIcon}
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {alert.title}
                        </Typography>
                      </Stack>
                      <Chip
                        label={getStatusChipLabel(alert.daysUntilExpiry)}
                        size="small"
                        sx={{
                          backgroundColor: statusChip.bg,
                          color: statusChip.color,
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </Stack>

                    <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Project: {alert.projectName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Document: {alert.documentType}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Branch: {alert.branchName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expiry Date: {alert.expiryDate}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color:
                            alert.daysUntilExpiry > 0
                              ? theme.palette.secondary.main
                              : theme.palette.error.main,
                        }}
                      >
                        {alert.description}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUploadClick(alert);
                        }}
                        startIcon={<RadioButtonChecked />}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          padding: "4px 10px",
                          textTransform: "none",
                          borderRadius: "8px",
                        }}
                      >
                        Resolve
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
            </List>

            {resolvedAlerts.length > 0 && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: priorityStyles.resolved.bg,
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: priorityStyles.resolved.color,
                    mr: 1,
                    fontSize: 20,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: priorityStyles.resolved.color, fontWeight: 500 }}
                >
                  {resolvedAlerts.length} alerts resolved and archived this
                  month
                </Typography>
              </Box>
            )}

            {activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 4 }}
              >
                No compliance alerts to display.
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Upload Dialog remains the same */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <UploadIcon />
            <Typography variant="h6">Upload Renewed Document</Typography>
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => setUploadDialogOpen(false)}
              disabled={uploading}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {selectedAlert && (
            <Stack spacing={3}>
              <Alert severity="info">
                Upload the renewed document to mark this alert as resolved.
              </Alert>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Document Details
                </Typography>
                <Typography variant="body2">
                  Type: {selectedAlert.documentType}
                </Typography>
                <Typography variant="body2">
                  Project: {selectedAlert.projectName}
                </Typography>
                <Typography variant="body2">
                  Branch: {selectedAlert.branchName}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Expiry: {selectedAlert.expiryDate} (
                  {getStatusChipLabel(selectedAlert.daysUntilExpiry)})
                </Typography>
              </Box>

              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                disabled={uploading}
              >
                {uploadFile
                  ? `Selected: ${uploadFile.name}`
                  : "Select Document"}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                />
              </Button>

              {uploading && <LinearProgress />}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setUploadDialogOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResolveAlert}
            disabled={!uploadFile || uploading}
            startIcon={!uploading ? <CheckCircleIcon /> : undefined}
          >
            {uploading ? "Uploading..." : "Resolve Alert"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComplianceAlerts;

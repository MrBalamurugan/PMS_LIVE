import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import CommonWidgetLayout from "../CommonWidgetLayout";

interface ApprovalItem {
  id: string;
  type: "discount" | "user-access" | "project-release" | "budget-increase";
  title: string;
  requester: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  priority: "high" | "medium" | "low";
  description?: string;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "1",
    type: "discount",
    title: "Special Discount Request - Enterprise Client",
    requester: "Sales Team",
    requestDate: "2024-01-15",
    status: "pending",
    priority: "high",
    description: "Request for 20% discount on annual enterprise plan",
  },
  {
    id: "2",
    type: "user-access",
    title: "Admin Access Request",
    requester: "John Smith",
    requestDate: "2024-01-14",
    status: "pending",
    priority: "medium",
    description: "Request for administrator privileges for new team lead",
  },
  {
    id: "3",
    type: "project-release",
    title: "Project Alpha - Production Release",
    requester: "Dev Team",
    requestDate: "2024-01-13",
    status: "pending",
    priority: "high",
    description: "Approval required for production deployment",
  },
  {
    id: "4",
    type: "budget-increase",
    title: "Budget Increase Request",
    requester: "Finance Team",
    requestDate: "2024-01-12",
    status: "pending",
    priority: "low",
    description: "Request to increase Q1 budget by 15%",
  },
];

const getApprovalLabel = (type: ApprovalItem["type"]) => {
  switch (type) {
    case "discount":
      return "Discount Approval";
    case "user-access":
      return "Access Request";
    case "project-release":
      return "Release Approval";
    case "budget-increase":
      return "Budget Approval";
    default:
      return "General Approval";
  }
};

const PendingApprovals = ({ loading = false }: { loading?: boolean }) => {
  const theme = useTheme();
  const [approvals] = useState<ApprovalItem[]>(mockApprovals);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pendingItems = approvals.filter((item) => item.status === "pending");

  // Priority styles using MUI theme
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
  };

  // Priority data for common layout
  const priorityData = {
    high: pendingItems.filter((a) => a.priority === "high").length,
    medium: pendingItems.filter((a) => a.priority === "medium").length,
    low: pendingItems.filter((a) => a.priority === "low").length,
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      <CommonWidgetLayout
        title="Pending Approvals"
        chipText={`${pendingItems.length} Pending`}
        chipColor={priorityStyles.medium.color}
        chipBgColor={priorityStyles.medium.bg}
        loading={loading}
        onOpenDrawer={handleOpenDrawer}
        priorityData={priorityData}
        priorityColors={priorityStyles}
      />

      {/* Drawer remains the same */}
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
                <Typography variant="h6" fontWeight={700}>
                  Pending Approvals
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {pendingItems.length} item
                  {pendingItems.length !== 1 ? "s" : ""} requiring action
                </Typography>
              </Box>
              <IconButton onClick={() => setDrawerOpen(false)} size="large">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {pendingItems.map((item) => (
                <ListItem key={item.id} sx={{ p: 0, alignItems: "stretch" }}>
                  <Box
                    sx={{
                      width: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2.5,
                      p: 2,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    {/* List item content remains the same */}
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ width: "100%", mb: 1 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.title}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={
                          item.priority.charAt(0).toUpperCase() +
                          item.priority.slice(1)
                        }
                        size="small"
                        sx={{
                          backgroundColor: priorityStyles[item.priority].bg,
                          color: priorityStyles[item.priority].color,
                          fontWeight: 700,
                          borderRadius: 1,
                          px: 0.5,
                          minWidth: 50,
                          textAlign: "center",
                          height: 20,
                          flexShrink: 0,
                        }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 0 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.requester}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.requestDate)
                            .toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })
                            .replace(/\//g, "/")}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="flex-end"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ flexGrow: 1, mt: 1 }}
                      >
                        {getApprovalLabel(item.type)}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexShrink: 0, mt: 1 }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // console.log("Reject", item.id);
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            minWidth: 70,
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // console.log("Approve", item.id);
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            minWidth: 70,
                          }}
                        >
                          Approve
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PendingApprovals;

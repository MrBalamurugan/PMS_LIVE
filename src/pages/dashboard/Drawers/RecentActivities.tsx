import {
  Box,
  Chip,
  List,
  Stack,
  Typography,
  useTheme,
  Skeleton,
  Drawer,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// icons
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { WarningAmber } from "@mui/icons-material";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "logged in successfully",
    date: "Oct 23",
    time: "02:30 PM",
    status: "success",
    type: "System",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "updated project details",
    date: "Oct 22",
    time: "01:15 PM",
    status: "success",
    type: "Project",
  },
  {
    id: 3,
    user: "Mike Chen",
    action: "created new branch",
    date: "Oct 22",
    time: "11:45 AM",
    status: "success",
    type: "Branch",
  },
  {
    id: 4,
    user: "Unknown User",
    action: "failed login attempt",
    date: "Oct 21",
    time: "10:20 AM",
    status: "failed",
    type: "System",
    tags: ["Failed"],
  },
  {
    id: 5,
    user: "Emma Davis",
    action: "approved compliance document",
    date: "Oct 21",
    time: "09:15 AM",
    status: "success",
    type: "Compliance",
  },
  {
    id: 6,
    user: "Unknown User",
    action: "failed login attempt",
    date: "Oct 21",
    time: "08:00 AM",
    status: "failed",
    type: "System",
    tags: ["Failed"],
  },
];

interface RecentActivitiesDrawerProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

const RecentActivitiesDrawer = ({
  open,
  onClose,
  loading,
}: RecentActivitiesDrawerProps) => {
  const theme = useTheme();

  const getStatusStyle = (status: "success" | "failed") => {
    if (status === "success") {
      return {
        iconColor: theme.palette.success.main,
        bgColor: theme.palette.success.light,
      };
    }

    return {
      iconColor: theme.palette.error.main,
      bgColor: theme.palette.error.light,
    };
  };

  const getTypeChipStyle = () => {
    return {
      bgColor: theme.palette.grey[100],
      textColor: theme.palette.text.primary,
    };
  };

  const ActivitySkeleton = () => (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[0],
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{ mt: 0.25, flexShrink: 0 }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Skeleton variant="text" width="25%" height={20} />
          </Stack>

          <Box sx={{ mt: 0.5 }}>
            <Skeleton
              variant="rectangular"
              width={60}
              height={20}
              sx={{ borderRadius: "6px" }}
            />
          </Box>

          {/* Row 3: Date and Time */}
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={15} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 560 },
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* DRAWER CONTAINER: Defines flex column layout */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* FIXED HEADER SECTION */}
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Recent Activities
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 10 audit logs
              </Typography>
            </Box>
            <IconButton
              size="large"
              onClick={onClose}
              aria-label="close recent activities"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          <List sx={{ p: 0 }}>
            {loading ? (
              <>
                <ActivitySkeleton />
                <ActivitySkeleton />
                <ActivitySkeleton />
                <ActivitySkeleton />
                <ActivitySkeleton />
              </>
            ) : (
              activities.map((act) => {
                const statusStyle = getStatusStyle(
                  act.status as "success" | "failed"
                );
                const typeChipStyle = getTypeChipStyle();
                const isFailed = act.status === "failed";

                return (
                  <Box
                    key={act.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[1],
                      "&:hover": {
                        boxShadow: theme.shadows[3],
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="flex-start"
                      justifyContent={"space-between"}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: statusStyle.bgColor,
                          flexShrink: 0,
                          mt: 0.25,
                          border: `1px solid ${statusStyle.bgColor}`,
                        }}
                      >
                        {isFailed ? (
                          <WarningAmber
                            sx={{ color: statusStyle.iconColor, fontSize: 18 }}
                          />
                        ) : (
                          <CheckCircleOutlineRoundedIcon
                            sx={{ color: statusStyle.iconColor, fontSize: 18 }}
                          />
                        )}
                      </Box>

                      {/* Text Content */}
                      <Box sx={{ flexGrow: 1 }}>
                        {/* Row 1: User and Action */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography variant="body1" fontWeight={500}>
                            {act.user}
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {act.action}
                          </Typography>
                        </Stack>

                        {/* Row 2: Chips */}
                        <Box sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            <Chip
                              label={act.type}
                              size="small"
                              sx={{
                                bgcolor: typeChipStyle.bgColor,
                                color: typeChipStyle.textColor,
                                fontWeight: 500,
                                borderRadius: "6px",
                                textTransform: "none",
                                height: "20px",
                                fontSize: "0.75rem",
                              }}
                            />

                            {/* Failed Chip (Rendered only on failed actions) */}
                            {isFailed && (
                              <Chip
                                label="Failed"
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.error.light,
                                  color: theme.palette.error.dark,
                                  fontWeight: 500,
                                  borderRadius: "6px",
                                  textTransform: "none",
                                  height: "20px",
                                  fontSize: "0.75rem",
                                }}
                              />
                            )}
                          </Stack>
                        </Box>

                        {/* Row 3: Date and Time */}
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {act.date}, {act.time}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                );
              })
            )}

            {/* No Activities Message */}
            {!loading && activities.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 4 }}
              >
                No recent activities to display.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RecentActivitiesDrawer;

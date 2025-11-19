import {
  Box,
  Stack,
  Typography,
  useTheme,
  ListItemText,
  LinearProgress,
  Paper,
} from "@mui/material";
import IconButton from "../../components/@extended/IconButton";
import LoginLogsDrawer from "./Drawers/LoginLogsDrawer";

// icons
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Cancel as CancelIcon } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";

import { useState } from "react";
// Mock Data
interface LoginAttemptsSummary {
  successful: number;
  failed: number;
}

const mockSummary: LoginAttemptsSummary = {
  successful: 3,
  failed: 2,
};

interface LoginLogsWidgetProps {
  loading?: boolean;
}

interface StatusBlockProps {
  status: "Successful" | "Failed";
  count: number;
}

const StatusBlock = ({ status, count }: StatusBlockProps) => {
  const theme = useTheme();
  const isSuccessful = status === "Successful";

  const colors = isSuccessful
    ? {
        main: theme.palette.success.main,
        light: "#EDFFF4",
      }
    : {
        main: theme.palette.error.main,
        light: "#FFECEC",
      };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        border: `2px solid ${colors.main}`,
        backgroundColor: colors.light,
        width: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 0 10px 0 ${colors.light}`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          {isSuccessful ? (
            <CheckCircleOutlineRoundedIcon sx={{ color: colors.main }} />
          ) : (
            <CancelIcon sx={{ color: colors.main }} />
          )}
          <Typography variant="subtitle1" fontWeight={500} color={colors.main}>
            {status}
          </Typography>
        </Stack>

        <Typography variant="h5" fontWeight={700} color={colors.main}>
          {count}
        </Typography>
      </Stack>
    </Box>
  );
};

// ==============================|| LOGIN LOGS WIDGET ||============================== //

const LoginLogsWidget = ({
  loading: widgetLoading = false,
}: LoginLogsWidgetProps) => {
  const theme = useTheme();
  const data = mockSummary;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);

    setIsDrawerLoading(true);
    setTimeout(() => {
      setIsDrawerLoading(false); // Stop loading after 1.5 seconds
    }, 1500);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);

    // setIsDrawerLoading(false);
  };

  if (widgetLoading) {
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
          Login Attempts
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
            Loading login details...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: "400px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: theme.palette.background.paper,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Typography variant="h5" fontWeight={600}>
            Login Attempts
          </Typography>

          <IconButton
            variant="light"
            shape="rounded"
            onClick={handleOpenDrawer}
            sx={{
              "&:hover": {
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
              },
            }}
          >
            <LoginIcon color="primary" />
          </IconButton>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={5} sx={{ flex: 1 }}>
            {/* Successful Attempts */}
            <StatusBlock status="Successful" count={data.successful} />

            {/* Failed Attempts */}
            <StatusBlock status="Failed" count={data.failed} />

            <Box textAlign="center" sx={{ mt: 3, mb: 1, pt: 2 }}>
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
                    onClick={handleOpenDrawer} // Opens the drawer on text click
                  >
                    Click to review all attempts
                  </Typography>
                }
              />
            </Box>
          </Stack>
        </Box>
      </Paper>

      <LoginLogsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        loading={isDrawerLoading}
      />
    </>
  );
};

export default LoginLogsWidget;

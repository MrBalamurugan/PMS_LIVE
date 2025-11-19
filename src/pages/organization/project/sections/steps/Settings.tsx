import { Box, Grid, Typography, Switch } from "@mui/material";

const Settings = () => {
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 3,
        maxHeight: "47vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "10px",
        },
      }}
    >
      <Grid container spacing={4}>
        {/* Active in Frontend */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>Active in Frontend</Typography>
              <Typography fontSize={13} color="text.secondary">
                Show this project on the public website
              </Typography>
            </Box>
            <Switch />
          </Box>
        </Grid>

        {/* Mark as Featured */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>Mark as Featured Project</Typography>
              <Typography fontSize={13} color="text.secondary">
                Highlight this project in marketing materials
              </Typography>
            </Box>
            <Switch />
          </Box>
        </Grid>

        {/* Allow Unit Booking */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>Allow Unit Booking</Typography>
              <Typography fontSize={13} color="text.secondary">
                Enable booking workflows for this project
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
        </Grid>

        {/* Allow Price Display */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>Allow Price Display</Typography>
              <Typography fontSize={13} color="text.secondary">
                Show pricing information publicly
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;

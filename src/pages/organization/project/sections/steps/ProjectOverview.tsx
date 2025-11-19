import {
  Box,
  Grid,
  TextField,
  // Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Divider,
} from "@mui/material";

const ProjectOverview = () => {
  // -------- Dropdown Static Data -------- //
  const projectTypes = ["Residential", "Commercial", "Mixed Use", "Industrial"];
  const countries = ["United Arab Emirates", "India", "Saudi Arabia", "USA"];
  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Riyadh"];
  const developers = ["Emaar", "DAMAC", "Nakheel", "Aldar"];
  const projectStatusList = ["Planned", "In Progress", "Completed", "On Hold"];
  const tenureList = ["Freehold", "Leasehold", "99 Years", "50 Years"];

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 2,
        maxHeight: "47vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin", // Firefox
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "10px",
        },
      }}
    >
      {/* Form Content */}
      <Grid container spacing={2}>
        {/* ROW 1 */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Project Name"
            required
            InputLabelProps={{ required: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Project Code" />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel required>Project Type</InputLabel>
            <Select label="Project Type">
              {projectTypes.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ROW 2 */}
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Location" />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel required>Country</InputLabel>
            <Select label="Country">
              {countries.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select label="City">
              {cities.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ROW 3 */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Developer/Builder Name</InputLabel>
            <Select label="Developer">
              {developers.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Registration Number" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Launch State" />
        </Grid>

        {/* ROW 4 */}
        <Grid item xs={12} md={4}>
          <TextField
            type="date"
            fullWidth
            label="Expected Completion"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Project Status</InputLabel>
            <Select label="Project Status">
              {projectStatusList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tenure</InputLabel>
            <Select label="Tenure">
              {tenureList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ROW 5 */}
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Operation Unit" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Zone" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Conditions" />
        </Grid>

        {/* ROW 6 */}
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Class" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Master Community" />
        </Grid>

        <Grid item xs={12} md={4}></Grid>

        {/* ROW 7 (Description full width) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            placeholder="Write project details..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectOverview;

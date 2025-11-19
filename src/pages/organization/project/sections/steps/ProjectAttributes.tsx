import { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ProjectAttributes = () => {
  // -------- Dropdown Static Data -------- //
  const projectTypes = ["Residential", "Commercial", "Mixed Use", "Industrial"];
  const countries = ["United Arab Emirates", "India", "Saudi Arabia", "USA"];
  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Riyadh"];

  // -------- Amenities State -------- //
  const [amenities, setAmenities] = useState([
    "Swimming Pool",
    "Gym",
    "Kids Play Area",
    "Parking",
    "Garden",
    "Security",
    "Swimming Pool",
    "Gym",
    "Kids Play Area",
    "Parking",
    "Garden",
    "Security",
    "Swimming Pool",
    "Gym",
    "Kids Play Area",
    "Parking",
    "Garden",
    "Security",
    "Swimming Pool",
    "Gym",
    "Kids Play Area",
    "Parking",
    "Garden",
    "Security",
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  const handleAddAmenity = () => {
    if (newAmenity.trim() !== "") {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity("");
      setOpenDialog(false);
    }
  };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 2,
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
      <Grid container spacing={2}>
        {/* ROW 1 */}
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Total Towers" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Total Units" />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Total Land Area/</InputLabel>
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
          <TextField fullWidth label="Total Build-Up area" />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Parking Facility</InputLabel>
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
            <InputLabel>Green Rating/Certification</InputLabel>
            <Select label="City">
              {cities.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ---------------- AMENITIES SECTION ---------------- */}
        <Grid item xs={12} mt={2}>
          <Divider />
        </Grid>

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Amenities</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenDialog(true)}
            disabled={amenities.length >= 15}
          >
            Add
          </Button>
        </Grid>

        {/* Amenities Checkboxes - 3 per row */}
        {amenities.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {amenities.map((item, index) => (
                <Grid item xs={12} sm={2} key={index}>
                  <FormControlLabel control={<Checkbox />} label={item} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* ---------- ADD AMENITY DIALOG ---------- */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Amenity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amenity Label"
            fullWidth
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAmenity}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectAttributes;

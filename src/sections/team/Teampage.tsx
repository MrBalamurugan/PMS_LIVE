import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// Avatar images (optional team logo)
const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  { eager: true }
);
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

// Initial values
const getInitialValues = (team: any) => ({
  teamName: team?.teamName || "",
  description: team?.description || "",
  lead: team?.lead || "",
  members: team?.members || [],
  status: team?.status || "Active",
});

const statuses = ["Active", "Inactive"];

import { IconButton } from "@mui/material";

const AddTeam = ({ team, users, onCancel, onSave }: any) => {
  console.log("usersAdd team", team);
  const theme = useTheme();
  const isCreating = !team?.id;
  const newId = isCreating ? uuidv4() : team.id;

  const [formValues, setFormValues] = useState(getInitialValues(team));

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const [userList, setUserList] = useState<any[]>([]);
  console.log("userList", userList);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!team?.orgId) return;
        const response = await fetch(
          `https://pms-db-mock.onrender.com/Users?orgId=${team?.orgId}`
        );
        if (!response.ok) throw new Error("Error fetching users");
        const data = await response.json();
        setUserList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [team?.orgId]);

  useEffect(() => {
    setFormValues(getInitialValues(team));
  }, [team]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: newId,
        orgId: team?.orgId,
        ...formValues,
      };

      const url = isCreating
        ? "https://pms-db-mock.onrender.com/Teams"
        : `https://pms-db-mock.onrender.com/Teams/${team.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error saving team");

      const result = await response.json();
      if (typeof onSave === "function") onSave(result, isCreating);
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* HEADER BAR */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, fontSize: "20px" }}
        >
          {isCreating ? "Add New Team" : "Update Team"}
        </Typography>
        <IconButton
          onClick={onCancel}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          ✕
        </IconButton>
      </Box>

      <Divider />

      {/* FORM CONTENT */}
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* Team Name */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="teamName">Team Name</InputLabel>
              <TextField
                fullWidth
                placeholder="Enter Team Name"
                value={formValues.teamName}
                onChange={(e) => handleChange("teamName", e.target.value)}
              />
            </Stack>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Enter Description"
                value={formValues.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Stack>
          </Grid>

          {/* Team Lead */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="lead">Team Lead</InputLabel>
              <FormControl fullWidth>
                <Select
                  value={formValues.lead}
                  onChange={(e) => handleChange("lead", e.target.value)}
                  input={<OutlinedInput />}
                >
                  {userList.map((u: any) => (
                    <MenuItem key={u.id} value={u.name}>
                      <ListItemText primary={u.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* Members */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="members">Members</InputLabel>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={formValues.members}
                  onChange={(e) =>
                    handleChange("members", e.target.value as string[])
                  }
                  input={<OutlinedInput />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {userList.map((u: any) => (
                    <MenuItem key={u.id} value={u.name}>
                      <ListItemText primary={u.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="status">Status</InputLabel>
              <FormControl fullWidth>
                <Select
                  value={formValues.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  input={<OutlinedInput />}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      <ListItemText primary={s} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      {/* ACTION BUTTONS */}
      <DialogActions sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button color="error" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {team ? "Update Team" : "Create Team"}
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};

AddTeam.propTypes = {
  team: PropTypes.any,
  users: PropTypes.array,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default AddTeam;

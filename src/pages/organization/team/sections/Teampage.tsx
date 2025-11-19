import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import * as Yup from "yup";

// MUI imports
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  FormHelperText,
  useTheme,
} from "@mui/material";

// Avatar Images
const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  { eager: true }
);
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

const statuses = ["Active", "Inactive"];
const branches = ["Chennai", "Coimbatore", "Madurai"];
const Counries = ["India", "USA", "Dubai", "UK"];

const businessUnits = ["Sales", "Lease", "Operations", "Marketing"];

// Validation (Business Type removed)
const validationSchema = Yup.object({
  teamName: Yup.string()
    .required("Team name is required")
    .max(50, "Max 50 characters"),
  description: Yup.string().required("Description is required"),
  country: Yup.string().required("Country is required"),
  manager: Yup.string().required("Manager is required"),
  members: Yup.array()
    .min(1, "Select at least one member")
    .required("Members are required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be before start date"),
  status: Yup.string().required("Status is required"),
  branch: Yup.string().required("Branch is required"),
  businessUnit: Yup.string().required("Business Unit is required"),
});

const AddTeam = ({ team, onCancel, onSave }: any) => {
  const theme = useTheme();
  const isCreating = !team?.id;
  const [userList, setUserList] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://pms-db-mock.onrender.com/Users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      teamName: team?.teamName || "",
      description: team?.description || "",
      country: team?.country || "",
      manager: team?.manager || "",
      members: team?.members || [],
      startDate: team?.startDate || "",
      endDate: team?.endDate || "",
      status: team?.status || "",
      branch: team?.branch || "",
      businessUnit: team?.businessUnit || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: team?.id || uuidv4(),
          orgId: team?.orgId,
          ...values,
        };
        const method = isCreating ? "POST" : "PUT";
        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Teams"
          : `https://pms-db-mock.onrender.com/Teams/${team.id}`;

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error saving team");
        const result = await response.json();
        onSave?.(result, isCreating);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 500 }}>
          {isCreating ? "Add New Team" : "Edit Team Details"}
        </Typography>
        <IconButton
          onClick={onCancel}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          ✕
        </IconButton>
      </Box>

      <Divider />

      {/* FORM */}
      <DialogContent sx={{ py: 3, px: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2.5}>
            {/* Team Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Name"
                id="teamName"
                name="teamName"
                value={formik.values.teamName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.teamName && Boolean(formik.errors.teamName)
                }
                helperText={
                  formik.touched.teamName &&
                  typeof formik.errors.teamName === "string"
                    ? formik.errors.teamName
                    : ""
                }
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.country && Boolean(formik.errors.country)}
              >
                <InputLabel>Country</InputLabel>
                <Select
                  id="country"
                  name="country"
                  label="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {Counries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.country &&
                  typeof formik.errors.country === "string" && (
                    <FormHelperText>{formik.errors.country}</FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description &&
                  typeof formik.errors.description === "string"
                    ? formik.errors.description
                    : ""
                }
              />
            </Grid>

            {/* Manager */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.manager && Boolean(formik.errors.manager)}
              >
                <InputLabel>Team Manager</InputLabel>
                <Select
                  id="manager"
                  name="manager"
                  label="Team Manager"
                  value={formik.values.manager}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Team Manager" />}
                >
                  {userList.map((u) => (
                    <MenuItem key={u.id} value={u.name}>
                      <ListItemText primary={u.name} />
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.manager &&
                  typeof formik.errors.manager === "string" && (
                    <FormHelperText>{formik.errors.manager}</FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Members */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.members && Boolean(formik.errors.members)}
              >
                <InputLabel>Members</InputLabel>
                <Select
                  id="members"
                  name="members"
                  multiple
                  value={formik.values.members}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Members" />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {userList.map((u) => (
                    <MenuItem key={u.id} value={u.name}>
                      <ListItemText primary={u.name} />
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.members &&
                  typeof formik.errors.members === "string" && (
                    <FormHelperText>{formik.errors.members}</FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Branch */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.branch && Boolean(formik.errors.branch)}
              >
                <InputLabel>Branch</InputLabel>
                <Select
                  id="branch"
                  name="branch"
                  label="Branch"
                  value={formik.values.branch}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {branches.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.branch &&
                  typeof formik.errors.branch === "string" && (
                    <FormHelperText>{formik.errors.branch}</FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Business Unit */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.businessUnit &&
                  Boolean(formik.errors.businessUnit)
                }
              >
                <InputLabel>Business Unit</InputLabel>
                <Select
                  id="businessUnit"
                  name="businessUnit"
                  label="Business Unit"
                  value={formik.values.businessUnit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {businessUnits.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.businessUnit &&
                  typeof formik.errors.businessUnit === "string" && (
                    <FormHelperText>
                      {formik.errors.businessUnit}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                id="startDate"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
                helperText={
                  formik.touched.startDate &&
                  typeof formik.errors.startDate === "string"
                    ? formik.errors.startDate
                    : ""
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                id="endDate"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={
                  formik.touched.endDate &&
                  typeof formik.errors.endDate === "string"
                    ? formik.errors.endDate
                    : ""
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  id="status"
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status &&
                  typeof formik.errors.status === "string" && (
                    <FormHelperText>{formik.errors.status}</FormHelperText>
                  )}
              </FormControl>
            </Grid>
          </Grid>

          {/* ACTION BUTTONS */}
          <DialogActions sx={{ mt: 3, px: 0 }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              width="100%"
            >
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                {isCreating ? "Create Team" : "Update Team"}
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

AddTeam.propTypes = {
  team: PropTypes.any,
  onCancel: PropTypes.func,
  users: PropTypes.array, // <-- Add this line

  onSave: PropTypes.func,
};

export default AddTeam;

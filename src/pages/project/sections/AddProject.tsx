import PropTypes from "prop-types";
// import { useState } from "react";
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
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
import { DeleteFilled } from "@ant-design/icons";
import { openSnackbar } from "../../../store/reducers/snackbar";
import { dispatch } from "../../../store";
import IconButton from "../../../components/@extended/IconButton";
// import AlertOrganisationDelete from "../organisation/AlertOrganizationDelete";

// ======================= STATIC DATA (inline) =======================
const projectTypes = ["Residential", "Commercial", "Industrial", "Land"];
// const branches = ["Headquarters", "Europe", "Asia", "North America"];
const currencies = [
  "USD - US Dollar",
  "GBP - British Pound",
  "EUR - Euro",
  "INR - Indian Rupee",
  "JPY - Japanese Yen",
];

// In-memory "database"
let organizations: any[] = [
  {
    id: uuidv4(),
    name: "Acme Corp",
    code: "ACM001",
    type: "Private",
    location: "New York",
    branch: "Headquarters",
    currency: "USD - US Dollar",
    taxRules: "US Federal",
    complianceDocuments: [],
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Globex Ltd",
    code: "GLX002",
    type: "Public",
    location: "London",
    branch: "Europe",
    currency: "GBP - British Pound",
    taxRules: "UK VAT",
    complianceDocuments: [],
    status: "Inactive",
  },
];

// Helper functions
// const addOrganization = (org: any) => {
//   const newOrg = { ...org, id: uuidv4() };
//   organizations.push(newOrg);
//   return newOrg;
// };
// const updateOrganization = (id: string, org: any) => {
//   const idx = organizations.findIndex((o) => o.id === id);
//   if (idx === -1) return null;
//   organizations[idx] = { ...organizations[idx], ...org };
//   return organizations[idx];
// };
const deleteOrganization = (id: string) => {
  organizations = organizations.filter((o) => o.id !== id);
};
// const findByName = (name: string) =>
//   organizations.filter((o) => o.name.toLowerCase() === name.toLowerCase());

// ================================================================

const getInitialValues = (project: any) => ({
  name: project?.name || "",
  code: project?.code || "",
  type: project?.type || "",
  location: project?.location || "",
  // branch: project?.branch || "",
  currency: project?.currency || "",
  taxRules: project?.taxRules || "",
  complianceDocuments: project?.complianceDocuments || [],
  status: project?.status || "Active",
});

export interface OrgRef {
  id: string;
  companyName: string;
}

export interface AddProjectProps {
  project?: any;
  customer?: any;
  onCancel: () => void;
  onSave: (result: any, isCreating: boolean) => void;
  orgId?: OrgRef;
}

const AddProject = ({
  // project,
  onCancel,
  onSave,
  customer,
  orgId,
}: AddProjectProps) => {
  // console.log("orgId", orgId);
  const theme = useTheme();
  const isCreating = !customer?.id;
  const newId = isCreating ? uuidv4() : customer.id;
  // console.log("customer", customer);

  // const [openAlert, setOpenAlert] = useState(false);

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    code: Yup.string().required("Project code is required"),
    type: Yup.string().required("Project type is required"),
    location: Yup.string().required("Location is required"),
    // branch: Yup.string().required("Branch is required"),
    currency: Yup.string().required("Currency is required"),
    status: Yup.string()
      .oneOf(["Active", "Inactive", "Archived"])
      .required("Status is required"),
  });
  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: ProjectSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          id: newId,
          OrgId: orgId?.id ?? "",
          OrgName: orgId?.companyName ?? "",
          ...values,
        };
        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Project"
          : `https://pms-db-mock.onrender.com/Project/${customer.id}`;
        const method = isCreating ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error saving project");

        const result = await response.json();

        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Project created successfully"
              : "Project updated successfully",
            variant: "alert",
            alert: { color: "success" },
            close: false,
          })
        );

        if (typeof onSave === "function") onSave(result, isCreating);
        onCancel();
      } catch (error: any) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Error creating project"
              : "Error updating project",
            variant: "alert",
            alert: { color: "error" },
            close: false,
          })
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            {/* HEADER */}
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
                {isCreating ? "Add New Project" : "Update Project"}
              </Typography>
              <IconButton
                onClick={onCancel}
                sx={{ color: theme.palette.primary.contrastText }}
              >
                ✕
              </IconButton>
            </Box>
            <Divider />

            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="name">Project Name</InputLabel>
                    <TextField
                      fullWidth
                      id="name"
                      placeholder="Enter Project Name"
                      {...getFieldProps("name")}
                      error={Boolean(touched.name && errors.name)}
                      helperText={
                        touched.name && typeof errors.name === "string"
                          ? errors.name
                          : undefined
                      }
                    />
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="code">Project Code</InputLabel>
                    <TextField
                      fullWidth
                      id="code"
                      placeholder="Enter Project Code"
                      {...getFieldProps("code")}
                      error={Boolean(touched.code && errors.code)}
                      helperText={
                        touched.code && typeof errors.code === "string"
                          ? errors.code
                          : undefined
                      }
                    />
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="location">Location</InputLabel>
                    <TextField
                      fullWidth
                      id="location"
                      placeholder="Enter Project Location"
                      {...getFieldProps("location")}
                      error={Boolean(touched.location && errors.location)}
                      helperText={
                        touched.location && typeof errors.location === "string"
                          ? errors.location
                          : undefined
                      }
                    />
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="taxRules">Tax Rules</InputLabel>
                    <TextField
                      fullWidth
                      id="taxRules"
                      placeholder="Enter Tax Rules"
                      {...getFieldProps("taxRules")}
                      multiline
                      minRows={2}
                    />
                  </Stack>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="type">Project Type</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        id="type"
                        displayEmpty
                        {...getFieldProps("type")}
                        onChange={(e) => setFieldValue("type", e.target.value)}
                        input={<OutlinedInput id="select-type" />}
                        renderValue={(selected) =>
                          selected || <Typography>Select Type</Typography>
                        }
                      >
                        {projectTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            <ListItemText primary={type} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  {/* <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="branch">Branch</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        id="branch"
                        displayEmpty
                        {...getFieldProps("branch")}
                        onChange={(e) =>
                          setFieldValue("branch", e.target.value)
                        }
                        input={<OutlinedInput id="select-branch" />}
                        renderValue={(selected) =>
                          selected || <Typography>Select Branch</Typography>
                        }
                      >
                        {branches.map((branch) => (
                          <MenuItem key={branch} value={branch}>
                            <ListItemText primary={branch} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack> */}

                  <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="currency">Currency</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        id="currency"
                        displayEmpty
                        {...getFieldProps("currency")}
                        onChange={(e) =>
                          setFieldValue("currency", e.target.value)
                        }
                        input={<OutlinedInput id="select-currency" />}
                        renderValue={(selected) =>
                          selected || <Typography>Select Currency</Typography>
                        }
                      >
                        {currencies.map((c) => (
                          <MenuItem key={c} value={c}>
                            <ListItemText primary={c} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 2 }}>
                    <InputLabel htmlFor="status">Status</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        id="status"
                        displayEmpty
                        {...getFieldProps("status")}
                        onChange={(e) =>
                          setFieldValue("status", e.target.value)
                        }
                        input={<OutlinedInput id="select-status" />}
                        renderValue={(selected) =>
                          selected || <Typography>Select Status</Typography>
                        }
                      >
                        {["Active", "Inactive", "Archived"].map((s) => (
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
            <DialogActions sx={{ p: 2.5 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete Organization" placement="top">
                      <IconButton
                        onClick={() => {
                          deleteOrganization(customer.id);
                          onCancel();
                        }}
                        size="large"
                        color="error"
                      >
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {customer ? "Update" : "Submit"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

AddProject.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  orgId: PropTypes.string,
};

export default AddProject;

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import IconButton from "../../../components/@extended/IconButton";
import { DeleteFilled } from "@ant-design/icons";
import AlertOrganisationDelete from "../../organization/org/sections/AlertOrganizationDelete";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

//  Redux
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../store/reducers/snackbar";

//  Validation Schema
const ProjectSchema = Yup.object().shape({
  projectName: Yup.string().required("Project name is required"),
  projectType: Yup.string(),
  associatedBranch: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  country: Yup.string(),
  localCurrency: Yup.string(),
  salesTeam: Yup.string(),
  financeTeam: Yup.string(),
  gst: Yup.number().typeError("Must be a number").min(0).max(100),
  stampDuty: Yup.number().typeError("Must be a number").min(0).max(100),
  status: Yup.string(),
});

const StaticProjectView = ({ item, onCancel, onSave, OrgId }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generatedCode, setGeneratedCode] = useState(item?.projectCode || "");

  //  Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "image/*": [] },
    multiple: true,
  });

  const handleAlertClose = () => {
    setOpenAlert(false);
    onCancel();
  };

  useEffect(() => {
    const fetchNextProjectCode = async () => {
      if (!item?.projectCode && OrgId) {
        try {
          const res = await fetch(
            `https://pms-db-mock.onrender.com/Project?orgId=${OrgId}`
          );
          const orgProjects = await res.json();

          const existingCodes = orgProjects
            .map((p: any) => {
              const match = p.projectCode?.match(/PRJ-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter((num: number) => !isNaN(num));

          const maxCode =
            existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
          const nextCode = (maxCode + 1).toString().padStart(4, "0");
          const code = `PRJ-${nextCode}`;
          setGeneratedCode(code);
        } catch (err) {
          console.error("Error generating project code:", err);
        }
      }
    };

    fetchNextProjectCode();
  }, [item, OrgId]);

  //  Initial Values
  const initialValues = {
    projectName: item?.projectName || "",
    projectType: item?.projectType || "",
    associatedBranch: item?.associatedBranch || "",
    projectCode: generatedCode,
    city: item?.city || "",
    state: item?.state || "",
    country: item?.country || "",
    latitude: item?.latitude || "",
    longitude: item?.longitude || "",
    localCurrency: item?.localCurrency || "",
    salesTeam: item?.salesTeam || "",
    financeTeam: item?.financeTeam || "",
    gst: item?.gst || "",
    stampDuty: item?.stampDuty || "",
    status: item?.status || "",
  };

  return (
    <>
      {/* Header */}
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
          {item ? "Project Details" : "New Project"}
        </Typography>
        <IconButton
          onClick={onCancel}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          ✕
        </IconButton>
      </Box>

      <Divider />

      {/*  Formik Form */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProjectSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const isCreating = !item?.id;
            const newId = item?.id || uuidv4();
            const codeToUse = values.projectCode || generatedCode;

            const payload = {
              orgId: OrgId,
              id: newId,
              ...values,
              projectCode: codeToUse,
              uploadedFiles: uploadedFiles.map((f) => f.name),
              createdOn: item?.createdOn || new Date().toISOString(),
              updatedOn: new Date().toISOString(),
            };

            const url = isCreating
              ? "https://pms-db-mock.onrender.com/Project"
              : `https://pms-db-mock.onrender.com/Project/${item.id}`;
            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save project");

            const result = await response.json();

            dispatch(
              openSnackbar({
                open: true,
                message: isCreating
                  ? "Project created successfully."
                  : "Project updated successfully.",
                variant: "alert",
                alert: { color: "success" },
                close: false,
              })
            );

            if (typeof onSave === "function") onSave(result, isCreating);
            onCancel();
          } catch (error: any) {
            console.error("Error saving project:", error);

            dispatch(
              openSnackbar({
                open: true,
                message: `Error saving project: ${error.message}`,
                variant: "alert",
                alert: { color: "error" },
                close: false,
              })
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {/* Project Name */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Project Name</Typography>
                  <TextField
                    fullWidth
                    name="projectName"
                    value={values.projectName}
                    onChange={handleChange}
                    error={touched.projectName && Boolean(errors.projectName)}
                    helperText={
                      touched.projectName && errors.projectName
                        ? String(errors.projectName)
                        : ""
                    }
                  />
                </Grid>
                {/* Project Code */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Project Code</Typography>
                  <TextField
                    fullWidth
                    name="projectCode"
                    value={values.projectCode || generatedCode}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {/* Project Type */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Project Type</Typography>
                  <TextField
                    select
                    fullWidth
                    name="projectType"
                    value={values.projectType}
                    onChange={handleChange}
                  >
                    <MenuItem value="internal">Internal</MenuItem>
                    <MenuItem value="external">External</MenuItem>
                    <MenuItem value="client">Client Project</MenuItem>
                  </TextField>
                </Grid>
                {/* Associated Branch */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Associated Branch</Typography>
                  <TextField
                    select
                    fullWidth
                    name="associatedBranch"
                    value={values.associatedBranch}
                    onChange={handleChange}
                  >
                    <MenuItem value="new-york">New York</MenuItem>
                    <MenuItem value="london">London</MenuItem>
                    <MenuItem value="tokyo">Tokyo</MenuItem>
                  </TextField>
                </Grid>
                {/* City / State */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">City</Typography>
                  <TextField
                    fullWidth
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    error={touched.city && Boolean(errors.city)}
                    helperText={
                      touched.city && typeof errors.city === "string"
                        ? errors.city
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">State</Typography>
                  <TextField
                    fullWidth
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Country</Typography>
                  <TextField
                    fullWidth
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Geo Coordinates */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Geo Coordinates</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="latitude"
                        placeholder="Latitude"
                        value={values.latitude}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="longitude"
                        placeholder="Longitude"
                        value={values.longitude}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Currency / Teams */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Local Currency</Typography>
                  <TextField
                    select
                    fullWidth
                    name="localCurrency"
                    value={values.localCurrency}
                    onChange={handleChange}
                  >
                    <MenuItem value="usd">USD</MenuItem>
                    <MenuItem value="eur">EUR</MenuItem>
                    <MenuItem value="inr">INR</MenuItem>
                    <MenuItem value="gbp">GBP</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Sales Team</Typography>
                  <TextField
                    select
                    fullWidth
                    name="salesTeam"
                    value={values.salesTeam}
                    onChange={handleChange}
                  >
                    <MenuItem value="team-a">Team A</MenuItem>
                    <MenuItem value="team-b">Team B</MenuItem>
                    <MenuItem value="team-c">Team C</MenuItem>
                  </TextField>
                </Grid>
                {/* Finance / GST / Stamp */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Finance Team</Typography>
                  <TextField
                    select
                    fullWidth
                    name="financeTeam"
                    value={values.financeTeam}
                    onChange={handleChange}
                  >
                    <MenuItem value="finance-a">Finance A</MenuItem>
                    <MenuItem value="finance-b">Finance B</MenuItem>
                    <MenuItem value="finance-c">Finance C</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">GST %</Typography>
                  <TextField
                    fullWidth
                    name="gst"
                    value={values.gst}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">Stamp Duty %</Typography>
                  <TextField
                    fullWidth
                    name="stampDuty"
                    value={values.stampDuty}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <TextField
                    select
                    fullWidth
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="on-hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Grid>
                {/* File Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Upload Files</Typography>
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <Typography>Drop the files here ...</Typography>
                    ) : (
                      <Typography>
                        Drag & drop files here, or click to select
                      </Typography>
                    )}
                  </div>

                  {uploadedFiles.length > 0 && (
                    <Stack mt={2} spacing={1}>
                      {uploadedFiles.map((file, index) => (
                        <Typography key={index} variant="body2">
                          📄 {file.name}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />

            {/* Footer */}
            <DialogActions sx={{ p: 2.5 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {item && (
                    <IconButton
                      onClick={() => setOpenAlert(true)}
                      size="large"
                      color="error"
                    >
                      <DeleteFilled />
                    </IconButton>
                  )}
                </Grid>

                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outlined" onClick={onCancel}>
                      Close
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        )}
      </Formik>

      {item && (
        <AlertOrganisationDelete
          title={initialValues.projectName}
          open={openAlert}
          handleClose={handleAlertClose}
        />
      )}
    </>
  );
};

StaticProjectView.propTypes = {
  OrgId: PropTypes.any.isRequired,
  item: PropTypes.any,
  onCancel: PropTypes.func.isRequired,
};

export default StaticProjectView;

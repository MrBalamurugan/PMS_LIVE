import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import { useTheme } from "@mui/material/styles";
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
  Checkbox,
} from "@mui/material";
import IconButton from "../../../../components/@extended/IconButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../../store/reducers/snackbar";
import AlertOrganisationDelete from "../../org/sections/AlertOrganizationDelete";

//  Validation Schema
const BranchSchema = Yup.object().shape({
  branchName: Yup.string().required("Branch name is required"),
  branchType: Yup.string(),
  branchAddress: Yup.string(),
  contactEmail: Yup.string(),
  contactNumber: Yup.string(),
  country: Yup.string(),
});

const BranchForm = ({ item, onCancel, onSave, OrgId }: any) => {
  // console.log("orgId", OrgId);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);

  //  Formik Setup
  const formik = useFormik({
    initialValues: {
      branchName: item?.branchName || "",
      branchCode: item?.branchCode || "",
      branchType: item?.branchType || "",
      branchAddress: item?.branchAddress || "",
      contactPerson: item?.contactPerson || "",
      contactNumber: item?.contactNumber || "",
      contactEmail: item?.contactEmail || "",
      branchHead: item?.branchHead || "",
      isActive: item?.isActive ?? true,
      country: item?.country || "",
    },
    validationSchema: BranchSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Fetch existing branches
        const res = await fetch("https://pms-db-mock.onrender.com/Branch");
        const allBranches = await res.json();

        // Filter only branches for this organization
        const orgBranches = allBranches.filter((b: any) => b.orgId === OrgId);

        // Check for duplicate name (case-insensitive) within the same org
        const duplicate = orgBranches.find(
          (b: any) =>
            b.branchName.trim().toLowerCase() ===
              values.branchName.trim().toLowerCase() && b.id !== item?.id
        );

        if (duplicate) {
          dispatch(
            openSnackbar({
              open: true,
              message: `Branch name "${values.branchName}" already exists for this organization.`,
              variant: "alert",
              alert: { color: "error" },
              close: false,
            })
          );
          setSubmitting(false);
          return;
        }

        const isCreating = !item?.id;
        let generatedCode = values.branchCode;

        //  Generate next sequential branch code only when creating a new one (per org)
        if (isCreating) {
          const existingCodes = orgBranches
            .map((b: any) => {
              const match = b.branchCode?.match(/BR-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter((num: any) => !isNaN(num));

          const maxCode =
            existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
          const nextCode = (maxCode + 1).toString().padStart(4, "0");
          generatedCode = `BR-${nextCode}`;
        }

        const newId = item?.id || uuidv4();
        const payload = {
          orgId: OrgId,
          id: newId,
          ...values,
          branchCode: generatedCode,
          createdOn: item?.createdOn || new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };

        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Branch"
          : `https://pms-db-mock.onrender.com/Branch/${item.id}`;
        const method = isCreating ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to save branch");

        const result = await response.json();

        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Branch created successfully."
              : "Branch updated successfully.",
            variant: "alert",
            alert: { color: "success" },
            close: false,
          })
        );

        if (typeof onSave === "function") onSave(result, isCreating);
        onCancel();
      } catch (error) {
        console.error("Error saving branch:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        dispatch(
          openSnackbar({
            open: true,
            message: `Error saving branch: ${errorMessage}`,
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
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    isSubmitting,
  } = formik;

  const handleAlertClose = () => {
    setOpenAlert(false);
    onCancel();
  };

  // Auto-generate next sequential Branch Code (Preview before save)
  useEffect(() => {
    const fetchNextBranchCode = async () => {
      if (!item?.branchCode && OrgId) {
        try {
          const res = await fetch("https://pms-db-mock.onrender.com/Branch");
          const branches = await res.json();

          //  Only check this organization's branches
          const orgBranches = branches.filter((b: any) => b.orgId === OrgId);

          const existingCodes = orgBranches
            .map((b: any) => {
              const match = b.branchCode?.match(/BR-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter((num: any) => !isNaN(num));

          const maxCode =
            existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
          const nextCode = (maxCode + 1).toString().padStart(4, "0");
          const generatedCode = `BR-${nextCode}`;
          setFieldValue("branchCode", generatedCode);
        } catch (err) {
          console.error("Error generating branch code:", err);
        }
      }
    };

    fetchNextBranchCode();
  }, [item, OrgId, setFieldValue]);

  return (
    <form onSubmit={handleSubmit}>
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
          {item ? "Edit Branch" : "Add Branch"}
        </Typography>
        <IconButton
          onClick={onCancel}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          ✕
        </IconButton>
      </Box>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          {/* Branch Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch Name"
              name="branchName"
              value={values.branchName}
              onChange={handleChange}
              error={touched.branchName && Boolean(errors.branchName)}
              helperText={
                touched.branchName && typeof errors.branchName === "string"
                  ? errors.branchName
                  : ""
              }
            />
          </Grid>

          {/* Branch Code */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch Code"
              name="branchCode"
              value={values.branchCode}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Branch Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="branchType"
              // label="Branch Type"
              value={values.branchType}
              onChange={handleChange}
              error={touched.branchType && Boolean(errors.branchType)}
              helperText={
                touched.branchType && typeof errors.branchType === "string"
                  ? errors.branchType
                  : ""
              }
              SelectProps={{ native: true }}
            >
              <option value="">Select Branch Type</option>
              <option value="Headquarters">Headquarters</option>
              <option value="Regional">Regional</option>
              <option value="Local">Local</option>
            </TextField>
          </Grid>
          {/* Country (only show after selecting Branch Type) */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="country"
              // label="Country"
              value={values.country}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Country</option>
              <option value="Philippines">Philippines</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </TextField>
          </Grid>

          {/* Branch Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="branchAddress"
              label="Branch Address"
              value={values.branchAddress}
              onChange={handleChange}
              error={touched.branchAddress && Boolean(errors.branchAddress)}
              helperText={
                touched.branchAddress &&
                typeof errors.branchAddress === "string"
                  ? errors.branchAddress
                  : ""
              }
            />
          </Grid>

          {/* Contact Person */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={values.contactPerson}
              onChange={handleChange}
            />
          </Grid>

          {/* Contact Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={values.contactNumber}
              onChange={handleChange}
              error={touched.contactNumber && Boolean(errors.contactNumber)}
              helperText={
                touched.contactNumber &&
                typeof errors.contactNumber === "string"
                  ? errors.contactNumber
                  : ""
              }
            />
          </Grid>

          {/* Contact Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Email"
              name="contactEmail"
              value={values.contactEmail}
              onChange={handleChange}
              error={touched.contactEmail && Boolean(errors.contactEmail)}
              helperText={
                touched.contactEmail && typeof errors.contactEmail === "string"
                  ? errors.contactEmail
                  : ""
              }
            />
          </Grid>

          {/* Branch Head */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              // label="Branch Head / Manager"
              name="branchHead"
              value={values.branchHead}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Head/Manager</option>
              <option value="Ramesh">Ramesh</option>
              <option value="Sanjay">Sanjay</option>
              <option value="Daniel">Daniel</option>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Checkbox
                checked={values.isActive}
                onChange={(e) => setFieldValue("isActive", e.target.checked)}
                sx={{ p: 0 }}
              />
              <Typography>Active</Typography>
            </Stack>

            {/* Info text */}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 0.5, ml: 3 }}
            >
              Branch is Active and operational
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions sx={{ p: 2.5 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            {/* {item && (
              <IconButton
                onClick={() => setOpenAlert(true)}
                size="large"
                color="error"
              >
                <DeleteFilled />
              </IconButton>
            )} */}
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="error" onClick={onCancel}>
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {item ? "Update Branch" : "Save Branch"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>

      {item && (
        <AlertOrganisationDelete
          title={item.branchName}
          open={openAlert}
          handleClose={handleAlertClose}
        />
      )}
    </form>
  );
};

BranchForm.propTypes = {
  OrgId: PropTypes.any,
  item: PropTypes.any,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default BranchForm;

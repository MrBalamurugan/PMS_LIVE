import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  // contactcode,
  countries,
  timezones,
  currencies,
  timeFormats,
  dateFormats,
} from "../../utils/staticData";
import { v4 as uuidv4 } from "uuid";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  // DialogTitle,
  Divider,
  FormControl,
  // FormControlLabel,
  FormLabel,
  Grid,
  // FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  // Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports

// assets
import { CameraOutlined, DeleteFilled } from "@ant-design/icons";
import Avatar from "../../components/@extended/Avatar";
import { openSnackbar } from "../../store/reducers/snackbar";
import { dispatch } from "../../store";
// import { ThemeMode } from "../../config";
import IconButton from "../../components/@extended/IconButton";
import AlertOrganisationDelete from "./AlertOrganizationDelete";

const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  {
    eager: true,
  }
);

// Turn it into a lookup object
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

// Example usage
// const avatarImage = avatarMap["avatar-1.png"];
// constant
const getInitialValues = (customer: any) => ({
  companyName: customer?.companyName || "",
  description: customer?.description || "",
  businessType: customer?.businessType || "",
  address1: customer?.address1 || "",
  address2: customer?.address2 || "",
  city: customer?.city || "",
  state: customer?.state || "",
  zip: customer?.zip || "",
  country: customer?.country || "",
  dateFormat: customer?.dateFormat || "",
  timeFormat: customer?.timeFormat || "12-hour (AM/PM)",
  timeZone: customer?.timeZone || "",
  currency: customer?.currency || "",
  contactCode: customer?.contactCode || "",
});
// const allStatus = ["Complicated", "Single", "Relationship"];

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddOrganisation = ({ customer, onCancel, onSave }: any) => {
  console.log("customer form", customer);
  const theme = useTheme();
  // const isCreating = !customer;
  const isCreating = !customer?.id;
  const newId = isCreating ? uuidv4() : customer.id;

  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const defaultAvatar = `avatar-${isCreating || !customer?.avatar ? 1 : customer.avatar}.png`;
  const [avatar, setAvatar] = useState(avatarMap[defaultAvatar]);

  const [logoBase64, setLogoBase64] = useState<string | undefined>(
    customer?.logo
  );
  console.log("logoBase64 form", logoBase64);
  useEffect(() => {
    if (selectedImage) {
      // Preview
      setAvatar(URL.createObjectURL(selectedImage));

      // Convert to Base64
      toBase64(selectedImage).then((base64) => setLogoBase64(base64));
    }
  }, [selectedImage]);

  const [openAlert, setOpenAlert] = useState(false);
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const CustomerSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    description: Yup.string(),
    // businessType: Yup.string().required("Business type is required"),
    address1: Yup.string().required("Address1 is required"),
    city: Yup.string().required("City is required"),
    // state: Yup.string().required("State is required"),
    zip: Yup.string().required("Zip code is required"),
    // country: Yup.string().required("Country is required"),
    // currency: Yup.string().required("Currency is required"),
    // dateFormat: Yup.string().required("Date format is required"),
    // timeFormat: Yup.string().required("Time format is required"),
    //   .min(1, "Invalid day")
    //   .max(31, "Invalid day")
    //   .required("Fiscal year starting day is required"),
    // timeZone: Yup.string().required("Timezone is required"),
  });

  const countryDefaults: Record<
    string,
    { timezone: string; currency: string; contactCode: string }
  > = {
    India: {
      timezone: "UTC+05:30",
      currency: "INR - Indian Rupee",
      contactCode: "+91",
    },
    "United States": {
      timezone: "UTC-05:00",
      currency: "USD - US Dollar",
      contactCode: "+1",
    },
    "United Kingdom": {
      timezone: "UTC+00:00",
      currency: "GBP - British Pound",
      contactCode: "+44",
    },
    Canada: {
      timezone: "UTC-05:00",
      currency: "CAD - Canadian Dollar",
      contactCode: "+1",
    },
    Australia: {
      timezone: "UTC+10:00",
      currency: "AUD - Australian Dollar",
      contactCode: "+61",
    },
    Germany: {
      timezone: "UTC+01:00",
      currency: "EUR - Euro",
      contactCode: "+49",
    },
    France: {
      timezone: "UTC+01:00",
      currency: "EUR - Euro",
      contactCode: "+33",
    },
    Japan: {
      timezone: "UTC+09:00",
      currency: "JPY - Japanese Yen",
      contactCode: "+81",
    },
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Step 1: Check for duplicate company name
        const duplicateCheck = await fetch(
          `https://pms-db-mock.onrender.com/Organizations?companyName=${encodeURIComponent(values.companyName)}`
        );
        const existing = await duplicateCheck.json();

        if (isCreating && existing.length > 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: "An organization with this company name already exists.",
              variant: "alert",
              alert: { color: "error" },
              close: false,
            })
          );
          setSubmitting(false);
          return; // Stop form submission
        }
        const payload = {
          id: newId,
          companyName: values.companyName,
          description: values.description,
          businessType: values.businessType,
          currency: values.currency,
          dateFormat: values.dateFormat,
          timeFormat: values.timeFormat,
          timeZone: values.timeZone,
          contactCode: values.contactCode,
          logo: logoBase64,
          address: {
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            state: values.state,
            country: values.country,
            zip: values.zip,
          },
        };

        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Organizations"
          : `https://pms-db-mock.onrender.com/Organizations/${customer.id}`;

        const method = isCreating ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(
            isCreating
              ? "Failed to create organization"
              : "Failed to update organization"
          );
        }

        const result = await response.json();
        console.log(isCreating ? "Created:" : "Updated:", result);

        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Organization created successfully."
              : "Organization updated successfully.",
            variant: "alert",
            alert: { color: "success" },
            close: false,
          })
        );
        if (typeof onSave === "function") onSave(result, isCreating);
        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Error creating organization"
              : "Error updating organization",
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
            {/* ================= HEADER ================= */}
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
                {isCreating ? "Add New Organization" : "Update Organization"}
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
                {/* Avatar / Logo Upload */}
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        position: "relative",
                        borderRadius: "50%",
                        overflow: "hidden",
                        "&:hover .MuiBox-root": { opacity: 1 },
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        alt="Company Logo"
                        src={logoBase64 || avatar}
                        sx={{ width: 72, height: 72, border: "1px dashed" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, .75)"
                              : "rgba(0,0,0,.65)",
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined
                            style={{
                              color: theme.palette.secondary.light,
                              fontSize: "2rem",
                            }}
                          />
                          <Typography sx={{ color: "secondary.lighter" }}>
                            Upload
                          </Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      sx={{ display: "none" }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedImage(e.target.files?.[0])
                      }
                      // onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>

                {/* Form Fields */}
                <Grid item xs={12} md={9}>
                  <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="company-name">Company</InputLabel>
                        <TextField
                          fullWidth
                          id="company-name"
                          placeholder="Enter Company Name"
                          {...getFieldProps("companyName")}
                          error={Boolean(
                            touched.companyName && errors.companyName
                          )}
                          helperText={
                            touched.companyName &&
                            typeof errors.companyName === "string"
                              ? errors.companyName
                              : undefined
                          }
                        />
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="description">
                          Description
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="description"
                          placeholder="Enter Description"
                          multiline
                          minRows={3}
                          {...getFieldProps("description")}
                          error={Boolean(
                            touched.description && errors.description
                          )}
                          helperText={
                            touched.description &&
                            typeof errors.description === "string"
                              ? errors.description
                              : undefined
                          }
                        />
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="address1">Address 1</InputLabel>
                        <TextField
                          fullWidth
                          id="address1"
                          placeholder="Enter Address 1"
                          {...getFieldProps("address1")}
                          error={Boolean(touched.address1 && errors.address1)}
                          helperText={
                            touched.address1 &&
                            typeof errors.address1 === "string"
                              ? errors.address1
                              : undefined
                          }
                        />
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="address2">Address 2</InputLabel>
                        <TextField
                          fullWidth
                          id="address2"
                          placeholder="Enter Address 2"
                          {...getFieldProps("address2")}
                          error={Boolean(touched.address2 && errors.address2)}
                          helperText={
                            touched.address2 &&
                            typeof errors.address2 === "string"
                              ? errors.address2
                              : undefined
                          }
                        />
                      </Stack>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="city">City</InputLabel>
                          <TextField
                            fullWidth
                            id="city"
                            placeholder="Enter City"
                            {...getFieldProps("city")}
                            error={Boolean(touched.city && errors.city)}
                            helperText={
                              touched.city && typeof errors.city === "string"
                                ? errors.city
                                : undefined
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="zip">Zip Code</InputLabel>
                          <TextField
                            fullWidth
                            id="zip"
                            placeholder="Enter Postal Code"
                            {...getFieldProps("zip")}
                            error={Boolean(touched.zip && errors.zip)}
                            helperText={
                              touched.zip && typeof errors.zip === "string"
                                ? errors.zip
                                : undefined
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="country">Country</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="country"
                            displayEmpty
                            {...getFieldProps("country")}
                            onChange={(event) => {
                              const selectedCountry = event.target.value;
                              setFieldValue("country", selectedCountry);

                              // Auto-fill timezone, currency & contact code
                              if (countryDefaults[selectedCountry]) {
                                setFieldValue(
                                  "timeZone",
                                  countryDefaults[selectedCountry].timezone
                                );
                                setFieldValue(
                                  "currency",
                                  countryDefaults[selectedCountry].currency
                                );
                                setFieldValue(
                                  "contactCode",
                                  countryDefaults[selectedCountry].contactCode
                                );
                              }
                            }}
                            input={<OutlinedInput id="select-country" />}
                            renderValue={(selected) =>
                              selected || (
                                <Typography>Select Country</Typography>
                              )
                            }
                          >
                            {countries.map((c) => (
                              <MenuItem key={c} value={c}>
                                <ListItemText primary={c} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="timeZone">Timezone</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="timeZone"
                            displayEmpty
                            {...getFieldProps("timeZone")}
                            onChange={(event) =>
                              setFieldValue("timeZone", event.target.value)
                            }
                            input={<OutlinedInput id="select-timeZone" />}
                            readOnly
                            renderValue={(selected) =>
                              selected || (
                                <Typography>Select Timezone</Typography>
                              )
                            }
                          >
                            {timezones.map((tz) => (
                              <MenuItem key={tz} value={tz}>
                                <ListItemText primary={tz} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="date-format">
                          Date Format
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="date-format"
                            displayEmpty
                            {...getFieldProps("dateFormat")}
                            onChange={(event) =>
                              setFieldValue("dateFormat", event.target.value)
                            }
                            input={<OutlinedInput id="select-date-format" />}
                            renderValue={(selected) =>
                              selected || (
                                <Typography>Select Date Format</Typography>
                              )
                            }
                          >
                            {dateFormats.map((format) => (
                              <MenuItem key={format} value={format}>
                                <ListItemText primary={format} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="time-format">
                          Time Format
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="time-format"
                            displayEmpty
                            {...getFieldProps("timeFormat")}
                            onChange={(event) =>
                              setFieldValue("timeFormat", event.target.value)
                            }
                            input={<OutlinedInput id="select-time-format" />}
                            renderValue={(selected) =>
                              selected || (
                                <Typography>Select Time Format</Typography>
                              )
                            }
                          >
                            {timeFormats.map((format) => (
                              <MenuItem key={format} value={format}>
                                <ListItemText primary={format} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack spacing={1.25} sx={{ mt: 2 }}>
                        <InputLabel htmlFor="currency">Currency</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="currency"
                            displayEmpty
                            {...getFieldProps("currency")}
                            onChange={(event) =>
                              setFieldValue("currency", event.target.value)
                            }
                            input={<OutlinedInput id="select-currency" />}
                            readOnly
                            renderValue={(selected) =>
                              selected || (
                                <Typography>Select Currency</Typography>
                              )
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
                    </Grid>
                  </Grid>
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
                    <Tooltip title="Delete Customer" placement="top">
                      <IconButton
                        onClick={() => setOpenAlert(true)}
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
      {!isCreating && (
        <AlertOrganisationDelete
          title={customer.fatherName}
          open={openAlert}
          handleClose={handleAlertClose}
        />
      )}
    </>
  );
};

AddOrganisation.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default AddOrganisation;

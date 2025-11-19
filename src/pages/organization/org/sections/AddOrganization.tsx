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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  // Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
import { openSnackbar } from "../../../../store/reducers/snackbar";
import { dispatch } from "../../../../store";
import IconButton from "../../../../components/@extended/IconButton";
import AlertOrganisationDelete from "./AlertOrganizationDelete";
import LogoUpload from "../../../../components/third-party/uploadfile/SingleFileUpload";

// ==============================|| ORGANIZATION ADD / EDIT ||============================== //

// Country data: states/provinces, default currency, time zones
const COUNTRY_DATA: Record<
  string,
  {
    states: { name: string; code?: string }[];
    currency: { code: string; label?: string };
    timeZones: { id: string; label?: string }[];
  }
> = {
  India: {
    states: [
      { name: "Maharashtra", code: "MH" },
      { name: "Karnataka", code: "KA" },
      { name: "Tamil Nadu", code: "TN" },
      { name: "Uttar Pradesh", code: "UP" },
      { name: "Gujarat", code: "GJ" },
    ],
    currency: { code: "INR", label: "Indian Rupee" },
    timeZones: [{ id: "IST", label: "IST (UTC+5:30)" }],
  },
  "United States": {
    states: [
      { name: "California", code: "CA" },
      { name: "Texas", code: "TX" },
      { name: "New York", code: "NY" },
      { name: "Florida", code: "FL" },
      { name: "Illinois", code: "IL" },
    ],
    currency: { code: "USD", label: "US Dollar" },
    timeZones: [
      { id: "PST", label: "PST (UTC-8)" },
      { id: "MST", label: "MST (UTC-7)" },
      { id: "CST", label: "CST (UTC-6)" },
      { id: "EST", label: "EST (UTC-5)" },
    ],
  },
  "United Kingdom": {
    states: [
      { name: "England", code: "ENG" },
      { name: "Scotland", code: "SCT" },
      { name: "Wales", code: "WLS" },
      { name: "Northern Ireland", code: "NIR" },
    ],
    currency: { code: "GBP", label: "British Pound" },
    timeZones: [
      { id: "GMT", label: "GMT (UTC+0)" },
      { id: "BST", label: "BST (UTC+1 - Summer)" },
    ],
  },
  "United Arab Emirates": {
    // user referred to "Dubai" earlier; map to UAE and include Dubai as an emirate
    states: [
      { name: "Dubai", code: "DU" },
      { name: "Abu Dhabi", code: "AD" },
      { name: "Sharjah", code: "SH" },
      { name: "Ajman", code: "AJ" },
      { name: "Fujairah", code: "FJ" },
    ],
    currency: { code: "AED", label: "UAE Dirham" },
    timeZones: [{ id: "GST", label: "Gulf Standard Time (UTC+4)" }],
  },
};

const AddOrganisation = ({ customer, onCancel, onSave }: any) => {
  // console.log("customer", customer);
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  useEffect(() => {
    if (customer?.logo) {
      setSelectedFile(customer.logo);
    }
  }, [customer]);
  const isCreating = !customer?.id;
  const newId = isCreating ? uuidv4() : customer.id;

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };
  // Helper to convert file to Base64
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Validation Schema
  const OrganizationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    parentName: Yup.string(),
    registeredAddress: Yup.string().required("Registered address is required"),
    state: Yup.string(),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    //  Conditional validation based on country
    gstNumber: Yup.string().when("country", {
      is: (country: any) => country === "India",
      then: (schema) =>
        schema
          .required("GST number is required for Indian organizations")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST format. Example: 27ABCDE1234F1Z5"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    einNumber: Yup.string().when("country", {
      is: (country: any) => country === "United States",
      then: (schema) =>
        schema
          .required(
            "Employer Identification number is required for USA organizations"
          )
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid EIN format. Example: 27ABCDE1234F1Z5"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    vatNumber: Yup.string().when("country", {
      is: (country: any) => country === "United Kingdom",
      then: (schema) =>
        schema
          .required("VAT number is required for USA organizations")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid VAT format. Example: 27ABCDE1234F1Z5"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    trnNumber: Yup.string().when("country", {
      is: (country: any) => country === "United Arab Emirates",
      then: (schema) =>
        schema
          .required("Tax Registration number is required for USA organizations")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid TRN format. Example: 27ABCDE1234F1Z5"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    panNumber: Yup.string().when("country", {
      is: (country: any) => country === "India",
      then: (schema) =>
        schema
          .required("PAN number is required for Indian organizations")
          .matches(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "Invalid PAN format. Example: ABCDE1234F"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    country: Yup.string().required("Country is required"),
    about: Yup.string(),

    telephone: Yup.string()
      .required()
      .matches(/^[0-9+\-\s()]{6,20}$/, "Enter a valid telephone number")
      .nullable(),
    tollFree: Yup.string()
      .required()
      .matches(/^[0-9+\-\s()]{6,20}$/, "Enter a valid toll-free number")
      .nullable(),

    defaultCurrency: Yup.string(),
    defaultTimeZone: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      companyName: customer?.companyName || "",
      parentName: customer?.fatherName || "",
      about: customer?.about || "",
      state: customer?.state || "",
      email: customer?.email || "",

      registeredAddress: customer?.address || "",
      gstNumber: customer?.GST || "",
      panNumber: customer?.PAN || "",
      einNumber: customer?.EIN || "",
      trnNumber: customer?.TRN || "",
      vatNumber: customer?.VAT || "",

      country: customer?.country || "",

      defaultCurrency: customer?.currency || "",
      defaultTimeZone: customer?.timeZone || "",

      telephone: customer?.telephone || "",
      tollFree: customer?.tollFree || "",
    },
    validationSchema: OrganizationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // const country = values.country?.trim();

        // Regional Validation Logic (India example)
        // if (country === "India") {
        // PAN Validation
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
        if (values.panNumber && !panRegex.test(values.panNumber)) {
          formik.setFieldError(
            "panNumber",
            "Invalid PAN format. Example: ABCDE1234F"
          );
          setSubmitting(false);
          return;
        }

        // GSTIN Validation
        const gstRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
        if (values.gstNumber && !gstRegex.test(values.gstNumber)) {
          formik.setFieldError(
            "gstNumber",
            "Invalid GST format. Example: 27ABCDE1234F1Z5 (15 alphanumeric characters)."
          );
          setSubmitting(false);
          return;
        }
        const existingRes = await fetch(
          "https://pms-db-mock.onrender.com/Organizations"
        );
        const existingOrgs = await existingRes.json();

        // Duplicate company name check
        const duplicateName = existingOrgs.find(
          (org: any) =>
            org.companyName.toLowerCase().trim() ===
              values.companyName.toLowerCase().trim() &&
            (!customer?.id || org.id !== customer.id)
        );

        // Duplicate PAN / GST / TIN checks
        const duplicatePAN = values.panNumber
          ? existingOrgs.find(
              (org: any) =>
                org.PAN?.toUpperCase() === values.panNumber.toUpperCase() &&
                (!customer?.id || org.id !== customer.id)
            )
          : null;

        const duplicateGST = values.gstNumber
          ? existingOrgs.find(
              (org: any) =>
                org.GST?.toUpperCase() === values.gstNumber.toUpperCase() &&
                (!customer?.id || org.id !== customer.id)
            )
          : null;

        if (duplicateName || duplicatePAN || duplicateGST) {
          let msg = "Duplicate record detected: ";
          if (duplicateName) msg += "Company name already exists. ";
          if (duplicatePAN) msg += "PAN number already exists. ";
          if (duplicateGST) msg += "GST number already exists. ";

          dispatch(
            openSnackbar({
              open: true,
              message: msg,
              variant: "alert",
              alert: { color: "error" },
              close: false,
            })
          );
          setSubmitting(false);
          return;
        }

        let base64Logo = null;

        if (selectedFile) {
          if (
            (typeof File !== "undefined" && selectedFile instanceof File) ||
            (typeof Blob !== "undefined" && selectedFile instanceof Blob)
          ) {
            base64Logo = await toBase64(selectedFile);
          } else if (typeof selectedFile === "string") {
            base64Logo = selectedFile;
          }
        }

        const payload = {
          id: newId,
          companyName: values.companyName,
          businessType: values.parentName || "Partner Organization",
          email: values.email,
          about: values.about || "",
          logo: base64Logo,
          address: {
            registeredAddress: values.registeredAddress || "",
            state: values.state || "",
            country: values.country || "",
          },
          GST: values.gstNumber || "",
          TRN: values.trnNumber || "",
          VAT: values.vatNumber || "",
          PAN: values.panNumber || "",
          EIN: values.einNumber || "",
          timeZone: values.defaultTimeZone || "",
          timeFormat: "24-hour",
          dateFormat: "yyyy-MM-dd",
          currency: values.defaultCurrency || "",
          telephone: values.telephone || "",
          tollFree: values.tollFree || "",
        };

        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Organizations"
          : `https://pms-db-mock.onrender.com/Organizations/${customer.id}`;
        const method = isCreating ? "POST" : "PUT";
        // console.log("method", method);
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to save organization");

        const result = await response.json();

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
            message: "Error saving organization",
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
    // setErrors,
    values,
  } = formik;

  // When country changes, update dependent fields (state, currency, timezone)
  const handleCountryChange = (countryValue: string) => {
    setFieldValue("country", countryValue);

    const info = COUNTRY_DATA[countryValue];
    if (info) {
      // set default state to first state if exists
      const firstState =
        info.states && info.states.length > 0 ? info.states[0].name : "";
      setFieldValue("state", firstState);

      // set default currency
      setFieldValue("defaultCurrency", info.currency.code || "");

      // set default timezone to first
      const firstTz =
        info.timeZones && info.timeZones.length > 0 ? info.timeZones[0].id : "";
      setFieldValue("defaultTimeZone", firstTz);
    } else {
      // country not in map: clear dependent fields
      setFieldValue("state", "");
      setFieldValue("defaultCurrency", "");
      setFieldValue("defaultTimeZone", "");
    }
  };

  // Initialize defaults when editing existing customer
  useEffect(() => {
    const c = formik.values.country;
    if (c && COUNTRY_DATA[c]) {
      const info = COUNTRY_DATA[c];
      // only set defaults if not populated (so we don't overwrite user-entered values)
      if (!formik.values.state && info.states && info.states.length > 0) {
        setFieldValue("state", info.states[0].name);
      }
      if (!formik.values.defaultCurrency && info.currency) {
        setFieldValue("defaultCurrency", info.currency.code);
      }
      if (
        !formik.values.defaultTimeZone &&
        info.timeZones &&
        info.timeZones.length > 0
      ) {
        setFieldValue("defaultTimeZone", info.timeZones[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]); // run on mount / when editing a different customer

  // Helper to get state list for current selected country
  const currentStates =
    values.country && COUNTRY_DATA[values.country]
      ? COUNTRY_DATA[values.country].states
      : [];
  const currentTimeZones =
    values.country && COUNTRY_DATA[values.country]
      ? COUNTRY_DATA[values.country].timeZones
      : [];
  const countryList = Object.keys(COUNTRY_DATA);

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

            {/* ================= CONTENT ================= */}
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {/* Company Name - Parent Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    {...getFieldProps("companyName")}
                    error={Boolean(touched.companyName && errors.companyName)}
                    helperText={
                      touched.companyName &&
                      typeof errors.companyName === "string"
                        ? errors.companyName
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Parent Name</InputLabel>
                    <Select
                      label="Parent Name"
                      {...getFieldProps("parentName")}
                      value={formik.values.parentName || ""}
                      onChange={(e) =>
                        setFieldValue("parentName", e.target.value)
                      }
                    >
                      <MenuItem value="">Select Parent</MenuItem>
                      <MenuItem value="Parent 1">Parent</MenuItem>
                      <MenuItem value="Parent 2">Subsidiary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  {/* Left side: Registered Address (50%) */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Registered Address"
                      {...getFieldProps("registeredAddress")}
                      error={Boolean(
                        touched.registeredAddress && errors.registeredAddress
                      )}
                      helperText={
                        touched.registeredAddress &&
                        typeof errors.registeredAddress === "string"
                          ? errors.registeredAddress
                          : ""
                      }
                      multiline
                      rows={3.5}
                    />
                  </Grid>

                  {/* Right side: Email + Toll-Free + Telephone (50%) */}
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                      {/* Email (top row, full width) */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          {...getFieldProps("email")}
                          error={Boolean(touched.email && errors.email)}
                          helperText={
                            touched.email && typeof errors.email === "string"
                              ? errors.email
                              : ""
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Telephone Number"
                          {...getFieldProps("telephone")}
                          error={Boolean(touched.telephone && errors.telephone)}
                          helperText={
                            touched.telephone &&
                            typeof errors.telephone === "string"
                              ? errors.telephone
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Toll-Free Number"
                          {...getFieldProps("tollFree")}
                          error={Boolean(touched.tollFree && errors.tollFree)}
                          helperText={
                            touched.tollFree &&
                            typeof errors.tollFree === "string"
                              ? errors.tollFree
                              : ""
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* About (Left) + Organization Logo (Right) */}
                <Grid container item xs={12} spacing={2}>
                  {/* Left side - About */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="About"
                      {...getFieldProps("about")}
                      multiline
                      rows={6}
                      placeholder="Enter a brief description about the organization"
                      error={Boolean(touched.about && errors.about)}
                      helperText={
                        touched.about && typeof errors.about === "string"
                          ? errors.about
                          : ""
                      }
                    />
                  </Grid>

                  {/* Right side - Organization Logo */}
                  <Grid item xs={12} sm={6}>
                    {" "}
                    <LogoUpload
                      onUpload={(file: any) => setSelectedFile(file)}
                      titlelogo="Organization Logo"
                      maxSizeMB={2}
                      defaultFile={customer?.logo || ""}
                    />
                  </Grid>
                </Grid>

                {/* Country, State, Default Currency, Default Time Zone (4 columns, 25% each) */}
                <Grid container item xs={12} spacing={2}>
                  {/* Country */}
                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      error={Boolean(touched.country && errors.country)}
                    >
                      <InputLabel>Country</InputLabel>
                      <Select
                        label="Country"
                        name="country"
                        value={formik.values.country || ""}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        onBlur={formik.handleBlur}
                      >
                        <MenuItem value="">Select Country</MenuItem>
                        {countryList.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.country &&
                        typeof errors.country === "string" && (
                          <Typography variant="caption" color="error">
                            {errors.country}
                          </Typography>
                        )}
                    </FormControl>
                  </Grid>

                  {/* State */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        label="State"
                        {...getFieldProps("state")}
                        value={formik.values.state || ""}
                        onChange={(e) => setFieldValue("state", e.target.value)}
                      >
                        <MenuItem value="">Select State</MenuItem>
                        {currentStates.map((s) => (
                          <MenuItem key={s.name} value={s.name}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Default Currency */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Default Currency</InputLabel>
                      <Select
                        label="Default Currency"
                        {...getFieldProps("defaultCurrency")}
                        value={formik.values.defaultCurrency || ""}
                        onChange={(e) =>
                          setFieldValue("defaultCurrency", e.target.value)
                        }
                      >
                        <MenuItem value="">Select Currency</MenuItem>
                        {/* Offer the current country's currency first, then some common options */}
                        {values.country && COUNTRY_DATA[values.country] ? (
                          <MenuItem
                            value={COUNTRY_DATA[values.country].currency.code}
                          >
                            {COUNTRY_DATA[values.country].currency.code} -{" "}
                            {COUNTRY_DATA[values.country].currency.label}
                          </MenuItem>
                        ) : null}
                        <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                        <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        <MenuItem value="AED">AED - UAE Dirham</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Default Time Zone */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Default Time Zone</InputLabel>
                      <Select
                        label="Default Time Zone"
                        {...getFieldProps("defaultTimeZone")}
                        value={formik.values.defaultTimeZone || ""}
                        onChange={(e) =>
                          setFieldValue("defaultTimeZone", e.target.value)
                        }
                      >
                        <MenuItem value="">Select Time Zone</MenuItem>
                        {/* Show current country's timezones if available */}
                        {currentTimeZones.map((tz) => (
                          <MenuItem key={tz.id} value={tz.id}>
                            {tz.id} {tz.label ? `- ${tz.label}` : ""}
                          </MenuItem>
                        ))}
                        {/* Fallback options */}
                        <MenuItem value="UTC">
                          UTC (Coordinated Universal Time)
                        </MenuItem>
                        <MenuItem value="IST">
                          IST (Indian Standard Time)
                        </MenuItem>
                        <MenuItem value="EST">
                          EST (Eastern Standard Time)
                        </MenuItem>
                        <MenuItem value="PST">
                          PST (Pacific Standard Time)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {formik.values.country === "India" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="GST Number"
                        {...getFieldProps("gstNumber")}
                        error={Boolean(touched.gstNumber && errors.gstNumber)}
                        helperText={
                          touched.gstNumber &&
                          typeof errors.gstNumber === "string"
                            ? errors.gstNumber
                            : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        {...getFieldProps("panNumber")}
                        error={Boolean(touched.panNumber && errors.panNumber)}
                        helperText={
                          touched.panNumber &&
                          typeof errors.panNumber === "string"
                            ? errors.panNumber
                            : ""
                        }
                      />
                    </Grid>
                  </>
                )}
                {formik.values.country === "United States" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="EIN Number"
                        {...getFieldProps("einNumber")}
                        error={Boolean(touched.einNumber && errors.einNumber)}
                        helperText={
                          touched.einNumber &&
                          typeof errors.einNumber === "string"
                            ? errors.einNumber
                            : ""
                        }
                      />
                    </Grid>
                  </>
                )}
                {formik.values.country === "United Kingdom" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="VAT Number"
                        {...getFieldProps("vatNumber")}
                        error={Boolean(touched.vatNumber && errors.vatNumber)}
                        helperText={
                          touched.vatNumber &&
                          typeof errors.vatNumber === "string"
                            ? errors.vatNumber
                            : ""
                        }
                      />
                    </Grid>
                  </>
                )}
                {formik.values.country === "United Arab Emirates" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="TRN Number"
                        {...getFieldProps("trnNumber")}
                        error={Boolean(touched.trnNumber && errors.trnNumber)}
                        helperText={
                          touched.trnNumber &&
                          typeof errors.trnNumber === "string"
                            ? errors.trnNumber
                            : ""
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>

            <Divider />

            {/* ================= FOOTER ================= */}
            <DialogActions sx={{ p: 2.5 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item></Grid>
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
                      {isCreating ? "Submit" : "Update"}
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
          title={customer?.companyName}
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

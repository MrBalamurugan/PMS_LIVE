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
  // ListItemText,
  MenuItem,
  // OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// assets
import { CameraOutlined, DeleteFilled } from "@ant-design/icons";
import Avatar from "../../components/@extended/Avatar";
import IconButton from "../../components/@extended/IconButton";
import { openSnackbar } from "../../store/reducers/snackbar";
import { dispatch } from "../../store";
// import { useOrganizations } from "../../feature/organization";

// Avatar images
const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  { eager: true }
);
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

// Initial values function
const getInitialValues = (user: any) => ({
  name: user?.name || "",
  email: user?.email || "",
  contactNo: user?.contactNo || "",
  address: user?.address || "",
  status: user?.status || "Pending",
  role: user?.role || "user",
});

const statuses = ["Pending", "Active", "Inactive"];
const roles = ["admin", "user", "manager"];

const AddUser = ({ user, onCancel, onSave }: any) => {
  const theme = useTheme();
  console.log("user", user);
  // const { data: organizations, isLoading, error } = useOrganizations();
  //testredux
  // useEffect(() => {
  //   console.log("Organizations data:", organizations);
  //   console.log("Loading state:", isLoading);
  //   console.log("Error:", error);
  // }, []);

  const isCreating = !user?.id;

  const newId = isCreating ? uuidv4() : user.id;

  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const defaultAvatar = `avatar-${isCreating || !user?.avatar ? 1 : user.avatar}.png`;
  const [avatar, setAvatar] = useState(avatarMap[defaultAvatar]);
  const [logoBase64, setLogoBase64] = useState<string | undefined>(
    user?.avatar
  );

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
      toBase64(selectedImage).then((base64) => setLogoBase64(base64));
    }
  }, [selectedImage]);

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNo: Yup.string().required("Contact No is required"),
    address: Yup.string().optional(),
    status: Yup.string().required("Status is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: getInitialValues(user),
    validationSchema: UserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          id: newId,
          avatar: logoBase64,
          orgId: user?.orgId,
          ...values,
        };

        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Users"
          : `https://pms-db-mock.onrender.com/Users/${user.id}`;
        const method = isCreating ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error saving user");

        const result = await response.json();
        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "User created successfully"
              : "User updated successfully",
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
            message: isCreating ? "Error creating user" : "Error updating user",
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
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              p: 1.5,
              // borderTopLeftRadius: "4px",
              // borderTopRightRadius: "4px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, fontSize: "20px" }}
            >
              {isCreating ? "Add New User" : "Update User"}
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
            <Grid
              container
              spacing={2}
              sx={{ maxHeight: "100%", overflow: "hidden" }}
            >
              {/* Avatar Upload */}
              <Grid item xs={12} sm={6} md={6}>
                {/* Avatar Upload */}
                <Grid item xs={12} sm={6} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                      position: "relative",
                    }}
                  >
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        cursor: "pointer",
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <Avatar
                        alt="User Avatar"
                        src={logoBase64 || avatar}
                        sx={{ width: 64, height: 64, border: "1px dashed" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.75)"
                              : "rgba(0,0,0,0.65)",
                          opacity: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          transition: "opacity 0.3s",
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        <CameraOutlined
                          style={{
                            color: theme.palette.secondary.light,
                            fontSize: "1.5rem",
                          }}
                        />
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      sx={{ display: "none" }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedImage(e.target.files?.[0])
                      }
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Name Field */}
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    id="name"
                    placeholder="Enter Name"
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={
                      touched.name && typeof errors.name === "string"
                        ? errors.name
                        : undefined
                    }
                  />
                </Stack>
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    placeholder="Enter Email"
                    {...getFieldProps("email")}
                    error={Boolean(touched.email && errors.email)}
                    helperText={
                      touched.email && typeof errors.email === "string"
                        ? errors.email
                        : undefined
                    }
                  />
                </Stack>
              </Grid>

              {/* Contact No Field */}
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="contactNo">Contact No</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    id="contactNo"
                    placeholder="Enter Contact No"
                    {...getFieldProps("contactNo")}
                    error={Boolean(touched.contactNo && errors.contactNo)}
                    helperText={
                      touched.contactNo && typeof errors.contactNo === "string"
                        ? errors.contactNo
                        : undefined
                    }
                  />
                </Stack>
              </Grid>

              {/* Address Field */}
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    id="address"
                    placeholder="Enter Address"
                    multiline
                    minRows={2}
                    {...getFieldProps("address")}
                    error={Boolean(touched.address && errors.address)}
                    helperText={
                      touched.address && typeof errors.address === "string"
                        ? errors.address
                        : undefined
                    }
                  />
                </Stack>
              </Grid>

              {/* Status and Role in the same row */}
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6}>
                  <Stack spacing={0.5}>
                    <InputLabel htmlFor="status">Status</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        id="status"
                        {...getFieldProps("status")}
                        onChange={(e) =>
                          setFieldValue("status", e.target.value)
                        }
                      >
                        {statuses.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={0.5}>
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        id="role"
                        {...getFieldProps("role")}
                        onChange={(e) => setFieldValue("role", e.target.value)}
                      >
                        {roles.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Delete User" placement="top">
                    <IconButton onClick={() => {}} size="large" color="error">
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
                    {user ? "Update" : "Submit"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

AddUser.propTypes = {
  user: PropTypes.any,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default AddUser;

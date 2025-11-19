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
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// assets
import { CameraOutlined } from "@ant-design/icons";
import Avatar from "../../../../components/@extended/Avatar";
import IconButton from "../../../../components/@extended/IconButton";
import { openSnackbar } from "../../../../store/reducers/snackbar";
import { dispatch } from "../../../../store";
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
  // userId: user?.userId || "",
  name: user?.name || "",
  email: user?.email || "",
  contactNo: user?.contactNo || "",
  address: user?.address || "",
  status: user?.status || "Active",
  manager: user?.manager || "Ramesh",
  startDate: user?.startDate || new Date().toISOString().split("T")[0], // current date
  endDate: user?.endDate || "",
  role: user?.role || "user",
});

const managers = ["Ramesh", "Karthik", "James"];
const statuses = ["Deactivated", "Active", "Suspended"];

const AddUser = ({ user, onCancel, onSave }: any) => {
  const [roles, setRoles] = useState([]);
  // console.log("roles", roles);
  const theme = useTheme();
  // console.log("user", user);

  const isCreating = !user?.id;
  const [orderByValue, setOrderByValue] = useState<number>(1);

  const fetchRole = async () => {
    try {
      const res = await fetch("https://pms-db-mock.onrender.com/Roles");
      const allroles = await res.json();
      setRoles(allroles);
    } catch (err) {
      console.log("Error fetching all roles", err);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchNextOrderBy = async () => {
      try {
        const res = await fetch("https://pms-db-mock.onrender.com/Users");
        const allUsers = await res.json();

        // If org-based ordering, filter by orgId
        const orgUsers = user?.orgId
          ? allUsers.filter((u: any) => u.orgId === user.orgId)
          : allUsers;

        const maxOrder = orgUsers.length
          ? Math.max(...orgUsers.map((u: any) => u.orderBy || 0))
          : 0;

        setOrderByValue(maxOrder + 1);
      } catch (err) {
        console.error("Error calculating next orderBy:", err);
      }
    };

    if (isCreating) {
      fetchNextOrderBy();
    } else if (user?.orderBy) {
      setOrderByValue(user.orderBy);
    }
  }, [isCreating, user?.orgId, user?.orderBy]);

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
      toBase64(selectedImage).then((base64) => {
        setLogoBase64(base64);
        setAvatar(base64); // preview uses base64 directly
      });
    }
  }, [selectedImage]);

  const UserSchema = Yup.object().shape({
    // userId: Yup.string().required("User ID is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNo: Yup.string()
      .matches(/^[0-9]+$/, "Contact No must contain only digits")
      .length(10, "Contact No must be exactly 10 digits")
      .required("Contact No is required"),
    address: Yup.string().optional(),
    status: Yup.string().required("Status is required"),
    manager: Yup.string().required("Manager is required"),

    role: Yup.string().required("Role is required"),
    startDate: Yup.date().required("Start date is required"),
  });

  const formik = useFormik({
    initialValues: getInitialValues(user),
    validationSchema: UserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Fetch all users to check for duplicates
        const res = await fetch("https://pms-db-mock.onrender.com/Users");
        const allUsers = await res.json();

        //  Check if email already exists (exclude current user if editing)
        const emailExists = allUsers.some(
          (u: any) =>
            u.email.toLowerCase() === values.email.toLowerCase() &&
            u.id !== user?.id
        );

        if (emailExists) {
          setFieldError("email", "This email is already in use");
          dispatch(
            openSnackbar({
              open: true,
              message: "Email already exists. Please use another one.",
              variant: "alert",
              alert: { color: "warning" },
              close: false,
            })
          );
          setSubmitting(false);
          return; // stop submission
        }
        const payload = {
          id: newId,
          orderBy: orderByValue,
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
        <Box
          sx={{
            width: "800px",
            maxWidth: "100%",
            margin: "0 auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
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
              <Grid container spacing={2}>
                {/* 1st Column: Avatar */}
                <Grid item xs={12} sm={4} md={3}>
                  <Stack alignItems="center" spacing={2}>
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
                        sx={{
                          width: 120,
                          height: 120,
                          border: "1px dashed",
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.75)"
                              : "rgba(0,0,0,0.55)",
                          opacity: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "opacity 0.3s",
                          "&:hover": { opacity: 1 },
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
                  </Stack>
                </Grid>

                {/* 2nd Column: Name, Contact No, Address, Start Date */}
                <Grid item xs={12} sm={4} md={4}>
                  <Stack spacing={2}>
                    {/* Name */}
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
                            : ""
                        }
                      />
                    </Stack>

                    {/* Contact No */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="contactNo">Contact No</InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        id="contactNo"
                        placeholder="Enter Contact No"
                        {...getFieldProps("contactNo")}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setFieldValue("contactNo", value);
                        }}
                        error={Boolean(touched.contactNo && errors.contactNo)}
                        helperText={
                          touched.contactNo &&
                          typeof errors.contactNo === "string"
                            ? errors.contactNo
                            : ""
                        }
                      />
                    </Stack>

                    {/* Address */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="address">Address</InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        id="address"
                        placeholder="Enter Address"
                        multiline
                        minRows={5}
                        {...getFieldProps("address")}
                        error={Boolean(touched.address && errors.address)}
                        helperText={
                          touched.address && typeof errors.address === "string"
                            ? errors.address
                            : ""
                        }
                      />
                    </Stack>

                    {/* Start Date */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="startDate">Start Date</InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        id="startDate"
                        {...getFieldProps("startDate")}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.startDate && errors.startDate)}
                        helperText={
                          touched.startDate &&
                          typeof errors.startDate === "string"
                            ? errors.startDate
                            : ""
                        }
                      />
                    </Stack>
                  </Stack>
                </Grid>

                {/* 3rd Column: Email, Role, Status, Manager, End Date */}
                <Grid item xs={12} sm={4} md={5}>
                  <Stack spacing={2}>
                    {/* Email */}
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
                            : ""
                        }
                      />
                    </Stack>

                    {/* Role */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="role">Role</InputLabel>
                      <FormControl fullWidth size="small">
                        <Select
                          id="role"
                          {...getFieldProps("role")}
                          onChange={(e) =>
                            setFieldValue("role", e.target.value)
                          }
                        >
                          {roles.map((r: any) => (
                            <MenuItem key={r.id} value={r.roleName}>
                              {r.roleName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    {/* Status */}
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

                    {/* Manager */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="manager">Manager</InputLabel>
                      <FormControl fullWidth size="small">
                        <Select
                          id="manager"
                          {...getFieldProps("manager")}
                          onChange={(e) =>
                            setFieldValue("manager", e.target.value)
                          }
                        >
                          {managers.map((m) => (
                            <MenuItem key={m} value={m}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    {/* End Date */}
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="endDate">End Date</InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        id="endDate"
                        {...getFieldProps("endDate")}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.endDate && errors.endDate)}
                        helperText={
                          touched.endDate && typeof errors.endDate === "string"
                            ? errors.endDate
                            : ""
                        }
                      />
                    </Stack>
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
                  {/* {!isCreating && (
                  <Tooltip title="Delete User" placement="top">
                    <IconButton onClick={() => {}} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )} */}
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
        </Box>
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

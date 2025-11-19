import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormikProvider, useFormik, Form } from "formik";
import * as Yup from "yup";
import { dispatch } from "../../../../store";
import { openSnackbar } from "../../../../store/reducers/snackbar";

// 🔹 Permission labels
const RIGHTS = ["View", "Create", "Update", "Delete"];

// 🔹 Static feature list
const STATIC_FEATURES = [
  "Organization",
  "Branch",
  "Project",
  "Property",
  "User",
  "Team",
];

const getInitialValues = (role: any) => ({
  roleName: role?.roleName || "",
  description: role?.description || "",
});

const UserRoleForm = ({ user, onCancel, onSave }: any) => {
  const theme = useTheme();
  const isCreating = !user?.id;

  const [loading, setLoading] = useState(true);
  // const [permissions, setPermissions] = useState<
  //   { entity: string; rights: string[] }[]
  // >([]);
  const [entityRights, setEntityRights] = useState<{
    [entity: string]: { [right: string]: boolean };
  }>({});

  // 🔹 Initialize permissions statically
  useEffect(() => {
    const initializePermissions = () => {
      setLoading(true);

      // If editing, load that role’s permissions
      const existingPermissions = user?.permissions || [];

      // Build entity-rights grid
      const rightsData: any = {};
      STATIC_FEATURES.forEach((entity) => {
        const matched = existingPermissions.find(
          (p: any) => p.entity === entity
        );
        rightsData[entity] = {};
        RIGHTS.forEach((right) => {
          rightsData[entity][right] = matched
            ? matched.rights.includes(right)
            : false;
        });
      });

      // setPermissions(
      //   STATIC_FEATURES.map((entity) => ({
      //     entity,
      //     rights:
      //       existingPermissions.find((p: any) => p.entity === entity)?.rights ||
      //       [],
      //   }))
      // );

      setEntityRights(rightsData);
      setLoading(false);
    };

    initializePermissions();
  }, [user]);

  // 🔹 Validation Schema
  const RoleSchema = Yup.object().shape({
    roleName: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
  });

  // 🔹 Formik Setup
  const formik = useFormik({
    initialValues: getInitialValues(user),
    validationSchema: RoleSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Convert checkbox selections into permissions array
        const formattedPermissions = Object.keys(entityRights).map(
          (entity) => ({
            entity,
            rights: Object.keys(entityRights[entity]).filter(
              (r) => entityRights[entity][r]
            ),
          })
        );

        const payload = {
          id: isCreating ? Date.now().toString() : user.id,
          ...values,
          permissions: formattedPermissions,
        };

        const url = isCreating
          ? "https://pms-db-mock.onrender.com/Roles"
          : `https://pms-db-mock.onrender.com/Roles/${user.id}`;
        const method = isCreating ? "POST" : "PUT";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error saving role");

        const result = await response.json();

        dispatch(
          openSnackbar({
            open: true,
            message: isCreating
              ? "Role created successfully"
              : "Role updated successfully",
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
            message: isCreating ? "Error creating role" : "Error updating role",
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  // 🔹 Toggle checkbox handler
  const handleToggle = (entity: string, right: string) => {
    setEntityRights((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [right]: !prev[entity][right],
      },
    }));
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
            {isCreating ? "Add New Role" : "Update Role"}
          </Typography>
          <Button
            onClick={onCancel}
            sx={{ color: theme.palette.primary.contrastText }}
          >
            ✕
          </Button>
        </Box>

        <Divider />

        {/* Content */}
        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Loading features and permissions...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Role Info */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="roleName">Role Name</InputLabel>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id="roleName"
                        placeholder="Enter role name"
                        {...getFieldProps("roleName")}
                        error={Boolean(touched.roleName && errors.roleName)}
                        helperText={
                          touched.roleName &&
                          typeof errors.roleName === "string"
                            ? errors.roleName
                            : ""
                        }
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Stack spacing={0.5}>
                      <InputLabel htmlFor="description">Description</InputLabel>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id="description"
                        placeholder="Enter description"
                        {...getFieldProps("description")}
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        helperText={
                          touched.description &&
                          typeof errors.description === "string"
                            ? errors.description
                            : ""
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* Features and Permissions Table */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontWeight: "bold", color: "text.primary" }}
                >
                  Features & Permissions
                </Typography>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Feature
                        </TableCell>
                        {RIGHTS.map((right) => (
                          <TableCell
                            key={right}
                            align="center"
                            sx={{ fontWeight: "bold" }}
                          >
                            {right}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {Object.keys(entityRights).map((entity) => (
                        <TableRow key={entity}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {entity}
                          </TableCell>
                          {RIGHTS.map((right) => (
                            <TableCell key={right} align="center">
                              <Checkbox
                                size="small"
                                checked={entityRights[entity]?.[right] || false}
                                onChange={() => handleToggle(entity, right)}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <Divider />

        {/* Footer */}
        <DialogActions sx={{ p: 2.5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isCreating ? "Submit" : "Update"}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

UserRoleForm.propTypes = {
  user: PropTypes.any,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default UserRoleForm;

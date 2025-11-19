import { useState, useEffect } from "react";
import type { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

interface UserRoleGridViewProps {
  data?: any; // expected to include { role: string, permissions: [{entity, rights: []}] }
}

const UserRoleGridView: FC<UserRoleGridViewProps> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [entityRights, setEntityRights] = useState<{
    [entity: string]: { [right: string]: boolean };
  }>({});

  // 🔹 Fetch role data from API and initialize permissions
  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://pms-db-mock.onrender.com/Roles");
        if (!res.ok) throw new Error("Failed to fetch roles");
        const roles = await res.json();

        const userRoleName = data?.[0]?.role;
        const matchedRole = roles.find(
          (r: any) => r.roleName.toLowerCase() === userRoleName?.toLowerCase()
        );

        if (!matchedRole) {
          setError("Role not found in backend");
          setLoading(false);
          return;
        }

        // 🔹 Build checkbox state based on backend permissions
        const initialRights: any = {};
        matchedRole.permissions.forEach((perm: any) => {
          const { entity, rights } = perm;
          initialRights[entity] = {};
          ["View", "Create", "Update", "Delete"].forEach((r) => {
            initialRights[entity][r] = rights.includes(r);
          });
        });

        setEntityRights(initialRights);
        setError(null);
      } catch (err) {
        console.error("Error fetching role permissions:", err);
        setError("Failed to load role permissions");
      } finally {
        setLoading(false);
      }
    };

    if (data && data.length > 0) {
      fetchRoleDetails();
    }
  }, [data]);

  // 🔹 Loading or error states
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ py: 2, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  // 🔹 Extract rights dynamically
  const displayEntities = Object.keys(entityRights);
  const displayRights = ["View", "Create", "Update", "Delete"];

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Entity</TableCell>
              {displayRights.map((right) => (
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
            {displayEntities.map((entity) => (
              <TableRow key={entity}>
                <TableCell sx={{ fontWeight: "medium" }}>{entity}</TableCell>
                {displayRights.map((right) => (
                  <TableCell key={right} align="center">
                    <Checkbox
                      size="small"
                      checked={entityRights[entity]?.[right] || false}
                      disabled
                      sx={{
                        color: "gray", // default gray for unchecked
                        "&.Mui-checked": {
                          color: "gray", // gray for checked
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserRoleGridView;

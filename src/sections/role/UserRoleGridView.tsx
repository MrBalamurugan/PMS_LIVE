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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "../../components/@extended/IconButton";

interface UserRoleGridViewProps {
  data?: any;
}

const roles = ["SuperAdmin", "Admin", "Manager", "User", "Partner", "Guest"];
const rights = ["View", "Create", "Update", "Delete"];
const entities = [
  "Organization",
  "Project",
  "Property",
  "User",
  "Role",
  "Team",
];

// Role-based permissions
const rolePermissions: { [role: string]: { [entity: string]: string[] } } = {
  SuperAdmin: {
    Organization: ["View", "Create", "Update", "Delete"],
    Project: ["View", "Create", "Update", "Delete"],
    Property: ["View", "Create", "Update", "Delete"],
    User: ["View", "Create", "Update", "Delete"],
    Role: ["View", "Create", "Update", "Delete"],
    Team: ["View", "Create", "Update", "Delete"],
  },
  Admin: {
    Project: ["View", "Create", "Update", "Delete"],
    Property: ["View", "Create", "Update", "Delete"],
    User: ["View", "Create", "Update", "Delete"],
    Role: ["View", "Create", "Update", "Delete"],
    Team: ["View", "Create", "Update", "Delete"],
  },
  Manager: {
    Property: ["View", "Create", "Update"],
    User: ["View"],
    Role: ["View", "Create", "Update"],
    Team: ["View", "Create", "Update"],
  },
  Partner: {
    Project: ["View", "Create", "Update"],
    Property: ["View", "Create", "Update"],
  },
  User: {
    Project: ["View", "Create", "Update", ""],
    Property: ["View", "Create", "Update", ""],
    User: ["View"],
  },
  Guest: {
    Organization: ["View"],
    Project: ["View"],
    Property: ["View"],
    User: ["View"],
    Role: ["View"],
    Team: ["View"],
  },
};
const UserRoleGridView: FC<UserRoleGridViewProps> = ({ data }) => {
  const displayRoles = data?.roles || roles;
  const displayRights = data?.rights || rights;
  const displayEntities = data?.entities || entities;
  console.log("datawww", data);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const [entityRights, setEntityRights] = useState<{
    [entity: string]: { [right: string]: boolean };
  }>({});

  const [savedRights, setSavedRights] = useState<{
    [entity: string]: { [right: string]: boolean };
  }>({});

  // Initialize entityRights
  useEffect(() => {
    if (data && data.length > 0) {
      const userRole = data[0].role; // "manager"
      const matchedRole = roles.find(
        (r) => r.toLowerCase() === userRole.toLowerCase()
      );
      setActiveRole(matchedRole || null);

      // initialize entityRights
      const initialRights: any = {};
      entities.forEach((entity) => {
        initialRights[entity] = {};
        rights.forEach((right) => {
          initialRights[entity][right] =
            rolePermissions[matchedRole || ""]?.[entity]?.includes(right) ||
            false;
        });
      });

      setEntityRights(initialRights);
      setSavedRights(initialRights);
    }
  }, [data]);

  const handleRoleChange = (role: string) => {
    if (activeRole === role) {
      // Uncheck active role → clear permissions
      setActiveRole(null);
      const clearedRights: any = {};
      displayEntities.forEach((entity: any) => {
        clearedRights[entity] = {};
        displayRights.forEach((right: any) => {
          clearedRights[entity][right] = false;
        });
      });
      setEntityRights(clearedRights);
    } else {
      // Switch to a new role
      setActiveRole(role);
      const newRights: any = {};
      displayEntities.forEach((entity: any) => {
        newRights[entity] = {};
        displayRights.forEach((right: any) => {
          newRights[entity][right] =
            rolePermissions[role]?.[entity]?.includes(right) || false;
        });
      });
      setEntityRights(newRights);
    }
  };

  const handleEntityRightChange = (entity: string, right: string) => {
    setEntityRights((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [right]: !prev[entity][right],
      },
    }));
  };

  const handleSave = () => {
    setSavedRights(entityRights);
    alert("Permissions saved!");
  };

  const handleReset = () => {
    const clearedRights: any = {};
    displayEntities.forEach((entity: any) => {
      clearedRights[entity] = {};
      displayRights.forEach((right: any) => {
        clearedRights[entity][right] = false;
      });
    });

    setEntityRights(clearedRights);
    setActiveRole(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Roles row with icons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Roles:</Typography>
          {displayRoles.map((role: any) => (
            <Box key={role} sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                size="small"
                checked={activeRole === role}
                onChange={() => handleRoleChange(role)}
              />
              <Typography>{role}</Typography>
            </Box>
          ))}
        </Box>

        {/* Save & Reset buttons */}
        <Box>
          <IconButton color="primary" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleReset}>
            <RestartAltIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Permission</TableCell>
              {displayRights.map((right: any) => (
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
            {displayEntities.map((entity: any) => (
              <TableRow key={entity}>
                <TableCell sx={{ fontWeight: "medium" }}>{entity}</TableCell>
                {displayRights.map((right: any) => (
                  <TableCell key={right} align="center">
                    <Checkbox
                      size="small"
                      checked={entityRights[entity]?.[right] || false}
                      onChange={() => handleEntityRightChange(entity, right)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </Box>
  );
};

export default UserRoleGridView;

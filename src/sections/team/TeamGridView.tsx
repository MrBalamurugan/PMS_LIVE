// src/sections/team/TeamGridView.tsx

import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

interface TeamGridViewProps {
  data: any;
}

const TeamGridView: FC<TeamGridViewProps> = ({ data }) => {
  if (!data) return null;
  console.log("datateam:", data);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!data?.orgId) return;
      try {
        setLoading(true);
        const res = await axios.get("https://pms-db-mock.onrender.com/Users");

        // Filter users
        const filtered = (res.data || []).filter(
          (user: any) =>
            user.orgId === data.orgId &&
            (data.members || []).includes(user.name)
        );
        setUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [data?.orgId]);

  if (!data?.orgId) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No organization selected.
      </Typography>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        {/* Table Header */}
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {users.length > 0 ? (
            users.map((user: any, idx: number) => (
              <TableRow key={user.id || idx}>
                {/* Profile */}
                <TableCell>
                  <Avatar alt={user.name} src={user.avatar || ""} />
                </TableCell>

                {/* Name */}
                <TableCell>{user.name}</TableCell>

                {/* Email */}
                <TableCell>{user.email || "-"}</TableCell>

                {/* Role */}
                <TableCell>{user.role || "Member"}</TableCell>

                {/* Status */}
                <TableCell>
                  {user.status === "Active" ? (
                    <Chip label="Active" color="success" size="small" />
                  ) : user.status === "Inactive" ? (
                    <Chip label="Inactive" color="error" size="small" />
                  ) : (
                    <Chip label="Pending" color="info" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2" color="text.secondary">
                  No members found for this organization.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamGridView;

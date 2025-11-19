// src/sections/team/TeamGridView.tsx

import { type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Stack,
  Grid,
} from "@mui/material";

interface TeamGridViewProps {
  data: any[]; // static users list passed from parent
}

const TeamGridView: FC<TeamGridViewProps> = ({ data }) => {
  if (!data) return null;

  const users = data;

  // Add empty placeholder rows (minimum 4 rows in the table)
  const MIN_ROWS = 4;
  const displayedRows = [
    ...users,
    ...Array(Math.max(MIN_ROWS - users.length, 0)).fill({}),
  ];

  return (
    <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
      {/* LEFT — Team Information */}
      <Box sx={{ width: "50%" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Team Details
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Team Description */}
          <InfoItem
            label="Description"
            value="This is a static team description placeholder."
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InfoItem label="Branch" value="Headquarters" />
            </Grid>
            <Grid item xs={4}>
              <InfoItem label="Business Unit" value="Engineering" />
            </Grid>
            <Grid item xs={4}>
              <InfoItem label="Business Type" value="Technology" />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* RIGHT — Members Table */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Team Members
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 206,
            overflowY: "auto",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedRows.map((user: any, idx: number) => (
                <TableRow
                  key={idx}
                  sx={{
                    backgroundColor: user.name ? "inherit" : "#fafafa",
                  }}
                >
                  <TableCell>{user.name || ""}</TableCell>
                  <TableCell>{user.email || ""}</TableCell>
                  <TableCell>{user.role || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

// Helper component for text items
const InfoItem = ({ label, value, sx }: any) => (
  <Stack spacing={0.3} sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={sx}>
      {value || "-"}
    </Typography>
  </Stack>
);

export default TeamGridView;

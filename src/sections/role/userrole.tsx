import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
} from "@mui/material";

import { EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import IconButton from "../../components/@extended/IconButton";
import Avatar from "../../components/@extended/Avatar";
import MainCard from "../../components/MainCard";
import { useLocation } from "react-router-dom";
import TeamGridView from "../team/TeamGridView";
import UserRoleGridView from "./UserRoleGridView";

// import TeamGridView from "path-to-your-TeamGridView";

const TabRole = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // 👈 expanded row state

  const location = useLocation();
  const { customer: org } = location.state || {};

  useEffect(() => {
    fetch("https://pms-db-mock.onrender.com/Users")
      .then((res) => res.json())
      .then((data) => {
        if (org?.id) {
          const filteredUsers = data.filter(
            (user: any) => user.orgId === org.id
          );
          setUsers(filteredUsers);
        } else {
          setUsers(data);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [org]);

  // 👇 render sub-component for expanded row
  const renderRowSubComponent = useCallback(
    (row: any) => {
      const team = row;
      const teamUsers = users.filter((u) =>
        team.members?.includes(u.name || u.fullName)
      );
      return <UserRoleGridView data={teamUsers} />;
    },
    [users]
  );
  8;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="" content={false}>
          <TableContainer>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right" colSpan={2} /> {/* extra column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <>
                    <TableRow hover key={user.id}>
                      <TableCell sx={{ pl: 3 }} component="th">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.25}
                        >
                          <Avatar alt={user.fullName} src={"/avatar-1.png"} />
                          <Stack spacing={0}>
                            <Typography variant="subtitle1">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="secondary">
                              {user.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        {user.role === "admin" && (
                          <Chip size="small" color="primary" label="Admin" />
                        )}
                        {user.role === "manager" && (
                          <Chip
                            size="small"
                            variant="light"
                            color="info"
                            label="Manager"
                          />
                        )}
                        {user.role === "user" && (
                          <Chip
                            size="small"
                            variant="light"
                            color="warning"
                            label="User"
                          />
                        )}
                        {user.role === "partner" && (
                          <Chip
                            size="small"
                            variant="light"
                            color="success"
                            label="Partner"
                          />
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell align="right">
                        {user.status === "Inactive" ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                            justifyContent="flex-end"
                          >
                            <Button size="small" color="error">
                              Resend
                            </Button>
                            <Chip
                              size="small"
                              color="info"
                              variant="outlined"
                              label="Invited"
                            />
                          </Stack>
                        ) : (
                          <Chip size="small" color="success" label="Joined" />
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          {/* Eye button */}
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === user.id ? null : user.id
                              )
                            }
                          >
                            <EyeOutlined style={{ fontSize: "1.15rem" }} />
                          </IconButton>

                          {/* Three-dot menu */}
                          <IconButton size="small" color="secondary">
                            <EllipsisOutlined style={{ fontSize: "1.15rem" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Expanded row */}
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                      >
                        <Collapse
                          in={expandedRow === user.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          {renderRowSubComponent(user)}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabRole;

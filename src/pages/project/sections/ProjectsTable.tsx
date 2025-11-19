import { useMemo, Fragment, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import IconButton from "../../../components/@extended/IconButton";

const API_URL = "https://pms-db-mock.onrender.com/Project";

import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../store/reducers/snackbar";
// ==============================|| PROJECTS TABLE VIEW ||============================== //

const ProjectsTable = ({ onEditProject, orgId }: any) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  // 🔹 API State
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch projects");

        const projects = await response.json();
        const filtered = orgId
          ? projects.filter((proj: any) => proj.orgId === orgId)
          : projects;

        setData(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [orgId]);

  const handleAlertClose = async (confirmDelete: boolean) => {
    setOpenAlert(false);

    if (!confirmDelete || !selectedProject) return;

    try {
      const response = await fetch(`${API_URL}/${selectedProject.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");

      // const result = await response.json();

      setData((prev) => prev.filter((p) => p.id !== selectedProject.id));

      //  Success Snackbar
      dispatch(
        openSnackbar({
          open: true,
          message: "Project deleted successfully.",
          variant: "alert",
          alert: { color: "success" },
          close: false,
        })
      );
    } catch (err: any) {
      //  Error Snackbar
      dispatch(
        openSnackbar({
          open: true,
          message: "Error deleting project.",
          variant: "alert",
          alert: { color: "error" },
          close: false,
        })
      );
    } finally {
      setSelectedProject(null);
    }
  };

  // ---------- COLUMNS ----------
  const columns = useMemo(
    () => [
      { Header: "Project Name", accessor: "projectName" },
      { Header: "Project Code", accessor: "projectCode" },
      { Header: "Type", accessor: "projectType" },
      { Header: "Branch", accessor: "associatedBranch" },
      { Header: "Country", accessor: "country" },
      {
        Header: "City / State",
        accessor: "city",
        Cell: ({ row }: any) => {
          const { city, state } = row.original;
          return `${city || "—"}, ${state || "—"}`;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: any) => {
          switch (value?.toLowerCase()) {
            case "active":
            case "ongoing":
              return <Chip label="Ongoing" size="small" color="info" />;
            case "completed":
              return <Chip label="Completed" size="small" color="success" />;
            case "delayed":
              return <Chip label="Delayed" size="small" color="error" />;
            case "on-hold":
              return <Chip label="On Hold" size="small" color="warning" />;
            default:
              return (
                <Chip
                  label={value || "Unknown"}
                  size="small"
                  variant="outlined"
                />
              );
          }
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }: any) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="Edit Project">
              <IconButton
                color="primary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onEditProject(row.original);
                }}
              >
                <EditTwoTone twoToneColor={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Project">
              <IconButton
                color="error"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setSelectedProject(row.original);
                  setOpenAlert(true);
                }}
              >
                <DeleteTwoTone twoToneColor={theme.palette.error.main} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [theme]
  );

  // ---------- REACT TABLE ----------
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      { columns, data },
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect
    ) as any;

  // ---------- RENDER ----------
  if (loading)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
        <CircularProgress />
        <Typography mt={2}>Loading projects...</Typography>
      </Stack>
    );

  if (error)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
        <Typography color="error">❌ {error}</Typography>
      </Stack>
    );

  return (
    <>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                sx={{ bgcolor: "#f5f5f5" }}
              >
                {headerGroup.headers.map((column: any) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: any) => {
                prepareRow(row);
                return (
                  <Fragment key={row.original.id}>
                    <TableRow {...row.getRowProps()} hover>
                      {row.cells.map((cell: any) => (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No projects available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openAlert} onClose={() => handleAlertClose(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedProject?.projectName}</strong>? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAlertClose(false)}>Cancel</Button>
          <Button
            onClick={() => handleAlertClose(true)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectsTable;

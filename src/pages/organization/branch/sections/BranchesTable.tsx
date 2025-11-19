import React, {
  useMemo,
  Fragment,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  // useMediaQuery,
  CircularProgress,
  TableFooter,
  TablePagination,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import IconButton from "../../../../components/@extended/IconButton";
import Avatar from "../../../../components/@extended/Avatar";
import AlertOrganisationDelete from "../../org/sections/AlertOrganizationDelete";

const BranchesTable = ({ onEditBranch, orgId }: any) => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedRow] = useState<number | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- FETCH BRANCHES FROM API ----------
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("https://pms-db-mock.onrender.com/Branch");
        if (!res.ok) throw new Error("Failed to fetch branch data");
        const data = await res.json();
        //  Filter branches by orgId here
        const filteredBranches = orgId
          ? data.filter((branch: any) => branch.orgId === orgId)
          : data;

        setBranches(filteredBranches);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);
  const handleAlertClose = async (confirmDelete: boolean) => {
    setOpenAlert(false);
    if (confirmDelete && selectedBranch) {
      try {
        await fetch(
          `https://pms-db-mock.onrender.com/Branch/${selectedBranch.id}`,
          {
            method: "DELETE",
          }
        );
        setBranches((prev) =>
          prev.filter((branch) => branch.id !== selectedBranch.id)
        );
      } catch (err) {
        console.error("Error deleting branch:", err);
      }
    }
  };

  // ---------- TABLE COLUMNS ----------
  const columns = useMemo(
    () => [
      {
        Header: "Branch Name",
        accessor: "branchName",
        Cell: ({ row }: any) => {
          const branch = row.original;
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                alt={branch.branchName}
                src="https://via.placeholder.com/40"
                sx={{ width: 40, height: 40 }}
              />
              <Typography>{branch.branchName}</Typography>
            </Stack>
          );
        },
      },
      {
        Header: "Branch Code",
        accessor: "branchCode",
      },
      {
        Header: "Address",
        accessor: "branchAddress",
        Cell: ({ value }: any) => value || "—",
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        Cell: ({ value }: any) => value || "—",
      },
      {
        Header: "Branch Head",
        accessor: "branchHead",
        Cell: ({ value }: any) => value || "—",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }: any) =>
          value ? (
            <Chip
              label="Active"
              size="small"
              color="success"
              variant="outlined"
            />
          ) : (
            <Chip
              label="Inactive"
              size="small"
              color="error"
              variant="outlined"
            />
          ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }: any) => {
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
          const open = Boolean(anchorEl);

          const handleMenuOpen = (
            event: React.MouseEvent<HTMLButtonElement>
          ) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = (event?: any) => {
            if (event) event.stopPropagation();
            setAnchorEl(null);
          };

          const handleAuditLog = (event: any) => {
            event.stopPropagation();
            handleMenuClose();
            navigate("/organizationoverview/auditlog");
          };

          return (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Tooltip title="Edit Branch">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onEditBranch("branch", row.original);
                  }}
                >
                  <EditTwoTone twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Branch">
                <IconButton
                  color="error"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setSelectedBranch(row.original);
                    setOpenAlert(true);
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>

              {/*  3-dot menu */}
              <Tooltip title="More Options">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>

              {/*  Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClick={(e) => e.stopPropagation()} // prevent row click
              >
                <MenuItem onClick={handleAuditLog}>Audit Log</MenuItem>
              </Menu>
            </Stack>
          );
        },
      },
    ],
    [theme, onEditBranch]
  );

  // ---------- REACT TABLE CONFIG ----------
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: branches,
      initialState: { pageIndex: 0, pageSize: 3 },
    } as any,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  ) as any;

  // ---------- EXPANDED ROW ----------
  const renderRowSubComponent = useCallback(
    ({ row }: any) => (
      <TableRow>
        <TableCell colSpan={8} sx={{ bgcolor: "#fafafa" }}>
          <Typography variant="body2">
            Branch <strong>{row.original.branchName}</strong> (Code:{" "}
            {row.original.branchCode}) created on{" "}
            {new Date(row.original.createdOn).toLocaleDateString()}.
          </Typography>
        </TableCell>
      </TableRow>
    ),
    []
  );

  // ---------- CONDITIONAL RENDERING ----------
  if (loading)
    return (
      <Stack alignItems="center" justifyContent="center" p={3}>
        <CircularProgress />
        <Typography mt={2}>Loading branches...</Typography>
      </Stack>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={2}>
        {error}
      </Typography>
    );

  // ---------- RENDER TABLE ----------
  return (
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
          {page.length > 0 ? (
            page.map((row: any) => {
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
                  {row.index === expandedRow && renderRowSubComponent({ row })}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="text.secondary">
                  No branch data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* ---------- PAGINATION CONTROLS ---------- */}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[3, 5, 10]}
              count={branches.length}
              rowsPerPage={pageSize}
              page={pageIndex}
              onPageChange={(newPage) => gotoPage(newPage)}
              onRowsPerPageChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <AlertOrganisationDelete
        title={selectedBranch?.branchName}
        open={openAlert}
        handleClose={handleAlertClose}
      />
    </TableContainer>
  );
};

export default BranchesTable;

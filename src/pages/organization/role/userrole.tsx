import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import {
  Button,
  // Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";

import {
  CSVExport,
  HeaderSort,
  // IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection,
} from "../../../components/third-party/ReactTable";

import {
  PlusOutlined,
  EditTwoTone,
  DeleteTwoTone,
  EyeTwoTone,
  CloseOutlined,
} from "@ant-design/icons";

import IconButton from "../../../components/@extended/IconButton";
import MainCard from "../../../components/MainCard";
import ScrollX from "../../../components/ScrollX";
import Loader from "../../../components/Loader";
import AddRoleForm from "./sections/UserRoleForm";
import AlertOrganisationDelete from "../org/sections/AlertOrganizationDelete";
import { dispatch } from "../../../store";
import { openSnackbar } from "../../../store/reducers/snackbar";
import UserRoleGridView from "./sections/UserRoleGridView";
import { GlobalFilter, renderFilterTypes } from "../../../utils/react-table";

// ==============================|| SELECTION CELLS ||============================== //

// const SelectionCell = ({ row }: any) => (
//   <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
// );
// const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }: any) => (
//   <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
// );

// ==============================|| REACT TABLE WRAPPER ||============================== //

function ReactTable({ columns, data, renderRowSubComponent }: any) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const filterTypes = useMemo(() => renderFilterTypes as any, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize, selectedRowIds },
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    setSortBy,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 5, //row data adjustment here
        sortBy: [{ id: "roleName", desc: false }],
      },
    } as any,
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  ) as any;

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(["description"]);
    } else {
      setHiddenColumns([]);
    }
  }, [matchDownSM]);

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />

      <Stack spacing={3}>
        {/* Filter & Sorting Controls */}
        <Stack
          direction={matchDownSM ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            // placeholder="Search roles..."
          />
          <Stack direction="row" spacing={1}>
            <SortingSelect
              allColumns={allColumns}
              sortBy={"roleName"}
              setSortBy={setSortBy}
            />
            <CSVExport
              data={
                selectedFlatRows.length > 0
                  ? selectedFlatRows.map((d: any) => d.original)
                  : data
              }
              filename={"roles-list.csv"}
            />
          </Stack>
        </Stack>

        {/* Table */}
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any, i: number) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, j: number) => (
                  <TableCell
                    key={j}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{
                      fontWeight: 600,
                      cursor: column.canSort ? "pointer" : "default",
                    }}
                  >
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: "center", py: 3 }}
                >
                  No roles available
                </TableCell>
              </TableRow>
            ) : (
              page.map((row: any, i: number) => {
                prepareRow(row);
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      sx={{
                        cursor: "pointer",
                        bgcolor: row.isSelected
                          ? alpha(theme.palette.primary.light, 0.3)
                          : "inherit",
                      }}
                    >
                      {row.cells.map((cell: any, k: number) => (
                        <TableCell key={k} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded && (
                      <TableRow>
                        <TableCell colSpan={headerGroups[0].headers.length}>
                          {renderRowSubComponent({ row })}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}

            {/* Pagination */}
            <TableRow>
              <TableCell colSpan={columns.length}>
                <TablePagination
                  gotoPage={gotoPage}
                  rows={rows}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// ==============================|| ROLE MANAGEMENT PAGE ||============================== //

const TabRole = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://pms-db-mock.onrender.com/Roles");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRoles(data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Handlers
  const handleAdd = (role = null) => {
    setSelectedRole(role);
    setOpenAddEdit((prev) => !prev);
  };

  const handleDeleteConfirm = async (confirm: boolean) => {
    setOpenDelete(false);
    if (!confirm || !roleToDelete) return;

    try {
      const res = await fetch(
        `https://pms-db-mock.onrender.com/Roles/${roleToDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete role");

      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));

      dispatch(
        openSnackbar({
          open: true,
          message: `Role "${roleToDelete.roleName}" deleted successfully`,
          variant: "alert",
          alert: { color: "success" },
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: "Error deleting role",
          variant: "alert",
          alert: { color: "error" },
        })
      );
    } finally {
      setRoleToDelete(null);
    }
  };

  // Columns with Sorting
  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "selection",
        // Cell: SelectionCell,
        disableSortBy: true,
      },
      {
        Header: "#",
        accessor: (_row: any, i: number) => i + 1,
        disableSortBy: true,
      },
      {
        Header: "Role Name",
        accessor: "roleName",
        sortType: "alphanumeric",
        Cell: ({ value }: any) => (
          <Typography variant="subtitle1" color="primary">
            {value}
          </Typography>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        sortType: "alphanumeric",
        Cell: ({ value }: any) => (
          <Typography variant="body2" color="text.secondary">
            {value || "—"}
          </Typography>
        ),
      },
      {
        Header: "Actions",
        disableSortBy: true,
        Cell: ({ row }: any) => (
          <Stack direction="row" justifyContent="center" spacing={0}>
            <Tooltip title="View Permissions">
              <IconButton
                color="secondary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  row.toggleRowExpanded();
                }}
              >
                {row.isExpanded ? (
                  <CloseOutlined style={{ color: theme.palette.error.main }} />
                ) : (
                  <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  handleAdd(row.original);
                }}
              >
                <EditTwoTone twoToneColor={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setRoleToDelete(row.original);
                  setOpenDelete(true);
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

  // Expanded Row
  const renderRowSubComponent = useCallback(
    ({ row }: any) => (
      <UserRoleGridView
        data={[
          {
            role: row.original.roleName,
            permissions: row.original.permissions,
          },
        ]}
      />
    ),
    []
  );

  return (
    <>
      {loading && <Loader />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Roles Management
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage, sort, and configure role permissions dynamically
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          onClick={() => handleAdd(null)}
        >
          Create Role
        </Button>
      </Stack>

      <MainCard content={false}>
        <ScrollX>
          <ReactTable
            columns={columns}
            data={roles}
            renderRowSubComponent={renderRowSubComponent}
          />
        </ScrollX>

        <AlertOrganisationDelete
          title={roleToDelete?.roleName}
          open={openDelete}
          handleClose={handleDeleteConfirm}
        />

        <Dialog
          open={openAddEdit}
          onClose={() => handleAdd(null)}
          fullWidth
          maxWidth="sm"
        >
          <AddRoleForm
            user={selectedRole}
            onCancel={() => handleAdd(null)}
            onSave={async () => {
              await fetchRoles();
              handleAdd(null);
            }}
          />
        </Dialog>
      </MainCard>
    </>
  );
};

export default TabRole;

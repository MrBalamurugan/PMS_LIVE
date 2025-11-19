// CustomerListPage.tsx (full file)
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { contactcode } from "../../../utils/staticData";
// material-ui
import { styled } from "@mui/material/styles";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  MenuItem,
  TextField,
  Dialog,
} from "@mui/material";

// third-party
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";

// project import
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection,
} from "../../../components/third-party/ReactTable";

// assets
import {
  CloseOutlined,
  PlusOutlined,
  EyeTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import IconButton from "../../../components/@extended/IconButton";
import Avatar from "../../../components/@extended/Avatar";
import MainCard from "../../../components/MainCard";
import ScrollX from "../../../components/ScrollX";
import AlertOrganisationDelete from "../org/sections/AlertOrganizationDelete";
import { GlobalFilter, renderFilterTypes } from "../../../utils/react-table";
import OrganizationView from "../org/OrganizationView";
import AddUser from "./sections/AddUser";
import Loader from "../../../components/Loader";

const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  {
    eager: true,
  }
);

// Turn it into a lookup object
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

// ==============================|| REACT TABLE ||============================== //
const TableWrapper = styled("div")(({ theme }: any) => ({
  position: "relative",

  th: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: theme.palette.background.paper,
    boxShadow: "0px 2px 2px rgba(0,0,0,0.05)",
  },

  // optional sticky first column
  "th:first-of-type, td:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 21,
    background: theme.palette.background.paper,
  },
}));

function ReactTable({
  columns,
  data,
  getHeaderProps,
  renderRowSubComponent,
  filterType,
  setFilterType,
  organizations,
}: any) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const showFilterDropdown = location.pathname === "/usermanagement/users";

  const filterTypes = useMemo(() => renderFilterTypes as any, []);
  const sortBy = { id: "name", desc: false };

  const FilterTypeSelect = ({
    filterType,
    setFilterType,
    organizations,
  }: any) => {
    return (
      <TextField
        select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All Organizations</MenuItem>
        {organizations.map((org: any) => (
          <MenuItem key={org.id} value={org.companyName}>
            {org.companyName}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ["avatar", "email"],
        sortBy: [sortBy],
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
      setHiddenColumns([
        "age",
        "contact",
        "visits",
        "email",
        "status",
        "avatar",
      ]);
    } else {
      setHiddenColumns(["avatar", "email"]);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? "column" : "row"}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Stack
            direction={matchDownSM ? "column" : "row"}
            alignItems="center"
            spacing={1}
          >
            {/* --- New dropdown styled same as Sort By --- */}
            {showFilterDropdown && (
              <FilterTypeSelect
                filterType={filterType}
                setFilterType={setFilterType}
                organizations={organizations}
              />
            )}

            {/* Existing Sort By dropdown */}
            <SortingSelect
              sortBy={sortBy.id}
              setSortBy={setSortBy}
              allColumns={allColumns}
            />

            <CSVExport
              data={
                selectedFlatRows.length > 0
                  ? selectedFlatRows.map((d: any) => d.original)
                  : data
              }
              filename={"customer-list.csv"}
            />
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: any, i: any) => (
              <TableRow
                key={i}
                {...headerGroup.getHeaderGroupProps()}
                sx={{ "& > th:first-of-type": { width: "58px" } }}
              >
                {headerGroup.headers.map((column: any, index: any) => (
                  <TableCell
                    key={index}
                    {...column.getHeaderProps([
                      { className: column.className },
                      getHeaderProps(column),
                    ])}
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
                  colSpan={visibleColumns.length}
                  sx={{ textAlign: "center", py: 3 }}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              page.map((row: any, i: any) => {
                prepareRow(row);
                const rowProps = row.getRowProps();

                return (
                  <Fragment key={i}>
                    <TableRow
                      {...rowProps}
                      onClick={() => row.toggleRowSelected()}
                      sx={{
                        cursor: "pointer",
                        bgcolor: row.isSelected
                          ? alpha(theme.palette.primary.light, 0.35)
                          : "inherit",
                      }}
                    >
                      {row.cells.map((cell: any, index: any) => (
                        <TableCell key={index} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>

                    {row.isExpanded &&
                      renderRowSubComponent({
                        row,
                        rowProps,
                        visibleColumns,
                        expanded,
                      })}
                  </Fragment>
                );
              })
            )}

            {/* Pagination row */}
            <TableRow sx={{ "&:hover": { bgcolor: "transparent !important" } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
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

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any,
  filterType: PropTypes.string,
  setFilterType: PropTypes.func,
  organizations: PropTypes.array,
};

// ==============================|| CUSTOMER - LIST ||============================== //

// Section Cell and Header
const SelectionCell = ({ row }: any) => (
  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
);

const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }: any) => (
  <IndeterminateCheckbox
    indeterminate
    {...getToggleAllPageRowsSelectedProps()}
  />
);

const CustomCell = ({ row }: any) => {
  const { values } = row;

  const hasValidBase64 =
    typeof values.avatar === "string" &&
    values.avatar.startsWith("data:image") &&
    values.avatar.length > 50;

  // Prefer the user's base64 avatar if available, else fall back to a static placeholder
  const src = hasValidBase64 ? values.avatar : avatarMap["avatar-1.png"];

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        alt={values.name}
        size="sm"
        src={src}
        sx={{
          width: 40,
          height: 40,
          border: "1px solid #ddd",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <Stack spacing={0}>
        <Typography variant="subtitle1">{values.name}</Typography>
        <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

type NumberFormatCellProps = {
  value: string;
  orgId: string | number;
  organizations: { id: string | number; country?: string }[];
};

const NumberFormatCell = ({
  value,
  orgId,
  organizations,
}: NumberFormatCellProps) => {
  if (!value) return "-";

  const org = organizations.find((o) => o.id === orgId);
  const country = org?.country;

  const countryCodeObj = contactcode.find((c) => c.name === country);
  const code = countryCodeObj ? countryCodeObj.code : "+91";

  return <Typography>{`${code} ${value}`}</Typography>;
};

const StatusCell = ({ value }: any) => {
  switch (value) {
    case "Active":
      return (
        <Chip color="success" label="Active" size="small" variant="outlined" />
      );
    case "Deactivated":
      return (
        <Chip
          color="error"
          label="Deactivated"
          size="small"
          variant="outlined"
        />
      );
    case "Suspended":
      return (
        <Chip color="info" label="Suspended" size="small" variant="outlined" />
      );
    default:
      return (
        <Chip
          color="default"
          label={value || "Unknown"}
          size="small"
          variant="outlined"
        />
      );
  }
};

const ActionCell = (
  row: any,
  setCustomer: any,
  setCustomerDeleteId: any,
  handleAdd: any,
  handleClose: any,
  setOpen: any,
  theme: any
) => {
  const collapseIcon = row.isExpanded ? (
    <CloseOutlined style={{ color: theme.palette.error.main }} />
  ) : (
    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  );
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0}
    >
      <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e: any) => {
            e.stopPropagation();
            row.toggleRowExpanded();
          }}
        >
          {collapseIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={(e: any) => {
            e.stopPropagation();
            setCustomer(row.original);
            handleAdd();
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
            handleClose();
            setCustomerDeleteId(row.original.id);
            setOpen(true);
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

StatusCell.propTypes = {
  value: PropTypes.number,
};

CustomCell.propTypes = {
  row: PropTypes.object,
};

SelectionCell.propTypes = {
  row: PropTypes.object,
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func,
};

const UserPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(""); // companyName or empty = all

  const { customer: orgFromLocation } = location.state || {};

  const [data, setData] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]); // Organizations

  // Fetch organizations once
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://pms-db-mock.onrender.com/Organizations"
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const orgs = await res.json();
        setOrganizations(orgs);

        // Set default filterType to first organization if none selected
        if (orgs.length > 0 && !filterType) {
          setFilterType(orgs[0].companyName);
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetchUsers reads filterType (companyName) and optionally the orgFromLocation override
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://pms-db-mock.onrender.com/Users");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const users = await res.json();

      // If route provided an org explicitly (orgFromLocation), prefer that filter (keeps old behavior)
      if (orgFromLocation?.id) {
        const filtered = users.filter(
          (user: any) => user.orgId === orgFromLocation.id
        );
        setData(filtered);
        return;
      }

      // Otherwise apply dropdown filter (filterType holds companyName)
      if (filterType) {
        const selectedOrg = organizations.find(
          (o) => o.companyName === filterType
        );
        const filtered = selectedOrg
          ? users.filter((u: any) => u.orgId === selectedOrg.id)
          : users;
        setData(filtered);
      } else {
        // filterType empty -> show all
        setData(users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts and whenever orgFromLocation or filterType changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgFromLocation?.id, filterType, organizations.length]);

  // local UI state
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<any | null>(null);
  const [customerDeleteId, setCustomerDeleteId] = useState<any>();

  const handleAdd = (user: any = null) => {
    if (user) setCustomer(user);
    setAdd((prev) => !prev);
    if (add) setCustomer(null);
  };

  const handleDelete = async (id: any) => {
    try {
      const res = await fetch(`https://pms-db-mock.onrender.com/Users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      // Remove the deleted user from state
      setData((prev) => prev.filter((user) => user.id !== id));
      // console.log(`User ${id} deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleClose = (confirmDelete = false) => {
    setOpen(false);

    if (confirmDelete && customerDeleteId) {
      handleDelete(customerDeleteId);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Row Selection",
        Header: SelectionHeader,
        accessor: "selection",
        Cell: SelectionCell,
        disableSortBy: true,
      },
      {
        Header: "#",
        accessor: "orderBy",
        className: "cell-center",
      },
      {
        Header: "User Name",
        accessor: "name",
        Cell: CustomCell,
      },

      {
        Header: "Avatar",
        accessor: "avatar",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          const hasValidBase64 =
            typeof value === "string" &&
            value.startsWith("data:image") &&
            value.length > 50;

          const src = hasValidBase64 ? value : avatarMap["avatar-1.png"];

          return (
            <Avatar
              alt="User Avatar"
              src={src}
              size="sm"
              sx={{
                width: 40,
                height: 40,
                border: "1px solid #ddd",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          );
        },
      },
      {
        Header: "Manager",
        accessor: "manager",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Contact",
        accessor: "contactNo",
        Cell: ({ value, row }: any) => (
          <NumberFormatCell
            value={value}
            orgId={row.original.orgId} // pass orgId
            organizations={organizations} // pass organizations list
          />
        ),
      },

      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusCell,
      },
      {
        Header: "Actions",
        className: "cell-center",
        disableSortBy: true,
        Cell: ({ row }: any) =>
          ActionCell(
            row,
            setCustomer,
            setCustomerDeleteId,
            handleAdd,
            handleClose,
            setOpen,
            theme
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, data, organizations]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: any) => <OrganizationView data={data[row.id]} />,
    [data]
  );

  return (
    <>
      {loading && <Loader />}
      {/* 🔹 Title Section OUTSIDE MainCard */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* Left side — Title */}
        <Stack spacing={0.5}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Organization Users
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage and assign users within this organization
          </Typography>
        </Stack>

        {/* Right side — Add button */}
        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </Stack>
      <MainCard content={false}>
        <ScrollX>
          <TableWrapper>
            <ReactTable
              columns={columns}
              data={data}
              handleAdd={handleAdd}
              getHeaderProps={(column: any) => column.getSortByToggleProps()}
              renderRowSubComponent={renderRowSubComponent}
              filterType={filterType}
              setFilterType={setFilterType}
              organizations={organizations}
            />
          </TableWrapper>
        </ScrollX>

        <AlertOrganisationDelete
          title={customerDeleteId}
          open={open}
          handleClose={handleClose}
        />
        {/* add user dialog */}
        <Dialog
          // anchor="right"
          open={add}
          onClose={() => handleAdd()}
          sx={{
            "& .MuiDrawer-paper": {
              width: 400, // adjust width
              p: 0,
              boxSizing: "border-box",
            },
          }}
        >
          <AddUser
            user={{ ...(customer || {}), orgId: orgFromLocation?.id }}
            onCancel={handleAdd}
            onSave={(savedUser: any, isCreating: boolean) => {
              if (isCreating) setData((prev) => [...prev, savedUser]);
              else
                setData((prev) =>
                  prev.map((u) => (u.id === savedUser.id ? savedUser : u))
                );
            }}
          />
        </Dialog>
      </MainCard>
    </>
  );
};

export default UserPage;

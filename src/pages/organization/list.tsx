import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { contactcode } from "../../utils/staticData";
// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import {
  Button,
  Chip,
  Dialog,
  Drawer,
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

// third-party
import { PatternFormat } from "react-number-format";
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
} from "../../components/third-party/ReactTable";

// assets
import {
  CloseOutlined,
  PlusOutlined,
  EyeTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import IconButton from "../../components/@extended/IconButton";
import Avatar from "../../components/@extended/Avatar";
import MainCard from "../../components/MainCard";
import ScrollX from "../../components/ScrollX";
import AlertOrganisationDelete from "../../sections/organisation/AlertOrganizationDelete";
import { GlobalFilter, renderFilterTypes } from "../../utils/react-table";
import OrganizationView from "../../sections/organisation/OrganizationView";
import AddUser from "../../sections/user/AddUser";

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

// Example usage
const avatarImage = avatarMap["avatar-1.png"];
// ==============================|| REACT TABLE ||============================== //

function ReactTable({
  columns,
  data,
  getHeaderProps,
  renderRowSubComponent,
  handleAdd,
}: any) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: "name", desc: false };

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
    },
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
            size="small"
          />
          <Stack
            direction={matchDownSM ? "column" : "row"}
            alignItems="center"
            spacing={1}
          >
            <SortingSelect
              sortBy={sortBy.id}
              setSortBy={setSortBy}
              allColumns={allColumns}
            />
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleAdd}
              size="small"
            >
              Add User
            </Button>
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
            {page.map((row: any, i: any) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{
                      cursor: "pointer",
                      bgcolor: row.isSelected
                        ? alpha(theme.palette.primary.light, 0.35)
                        : "inherit",
                    }}
                  >
                    {row.cells.map((cell: any, index: any) => (
                      <TableCell
                        key={index}
                        {...cell.getCellProps([
                          { className: cell.column.className },
                        ])}
                      >
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
            })}
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
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar alt="Avatar 1" size="sm" src={avatarMap[`avatar-${1}.png`]} />
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
  console.log("countryCode", country);

  const countryCodeObj = contactcode.find((c) => c.name === country);
  const code = countryCodeObj ? countryCodeObj.code : "+91";

  return <Typography>{`${code} ${value}`}</Typography>;
};

const StatusCell = ({ value }: any) => {
  switch (value) {
    case "Active":
      return (
        <Chip color="success" label="Active" size="small" variant="light" />
      );
    case "Inactive":
      return (
        <Chip color="error" label="Inactive" size="small" variant="light" />
      );
    case "Pending":
      return <Chip color="info" label="Pending" size="small" variant="light" />;
    default:
      return (
        <Chip
          color="default"
          label={value || "Unknown"}
          size="small"
          variant="light"
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
            setCustomer(row.values);
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
            setCustomerDeleteId(row.values.name);
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

// NumberFormatCell.propTypes = {
//   value: PropTypes.string,
//   orgId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   organizations: PropTypes.array,
// };

CustomCell.propTypes = {
  row: PropTypes.object,
};

SelectionCell.propTypes = {
  row: PropTypes.object,
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func,
};

const CustomerListPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const { customer: org } = location.state || {}; // fallback to empty object if not passed

  const [data, setData] = useState<any[]>([]);
  console.log("Customer org:", data);
  const [organizations, setOrganizations] = useState<any[]>([]); // Organizations
  console.log("organizationsname", organizations);
  useEffect(() => {
    fetch("https://pms-db-mock.onrender.com/Organizations")
      .then((res) => res.json())
      .then((orgs) => setOrganizations(orgs))
      .catch((err) => console.error("Failed to fetch organizations:", err));
  }, []);

  useEffect(() => {
    fetch("https://pms-db-mock.onrender.com/Users")
      .then((res) => res.json())
      .then((users) => {
        // Filter users whose id matches org.id
        const filtered = org?.id
          ? users.filter((user: any) => user.orgId === org.id)
          : users;
        setData(filtered);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, [org]);
  // const data = useMemo(() => makeData(3), []);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState();
  const [customerDeleteId, setCustomerDeleteId] = useState();

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleClose = () => {
    setOpen(!open);
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
        accessor: "order",
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
            theme
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: any) => <OrganizationView data={data[row.id]} />,
    [data]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          getHeaderProps={(column) => column.getSortByToggleProps()}
          renderRowSubComponent={renderRowSubComponent}
        />
      </ScrollX>
      <AlertOrganisationDelete
        title={customerDeleteId}
        open={open}
        handleClose={handleClose}
      />
      {/* add user dialog */}
      <Drawer
        anchor="right"
        open={add}
        onClose={handleAdd}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400, // adjust width
            p: 0,
            boxSizing: "border-box",
          },
        }}
      >
        <AddUser
          user={{ ...(customer || {}), orgId: org?.id }}
          onCancel={handleAdd}
          onSave={(savedUser, isCreating) => {
            if (isCreating) setData((prev) => [...prev, savedUser]);
            else
              setData((prev) =>
                prev.map((u) => (u.id === savedUser.id ? savedUser : u))
              );
          }}
        />
      </Drawer>
    </MainCard>
  );
};

export default CustomerListPage;

import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";

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
import { PopupTransition } from "../../components/@extended/Transitions";
import IconButton from "../../components/@extended/IconButton";
import Avatar from "../../components/@extended/Avatar";
import MainCard from "../../components/MainCard";
import ScrollX from "../../components/ScrollX";
import AlertOrganisationDelete from "../../sections/organisation/AlertOrganizationDelete";
import { GlobalFilter, renderFilterTypes } from "../../utils/react-table";
import OrganizationView from "../../sections/organisation/OrganizationView";
import AddUser from "../../sections/user/AddUser";
import AddTeam from "../../sections/team/Teampage";
import TeamGridView from "../../sections/team/TeamGridView";

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
  const sortBy = { id: "fullname", desc: false };

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
              Add Teams
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
                  {row.isExpanded && (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length}>
                        <TeamGridView data={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
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
        <Typography variant="subtitle1">{values.fullName}</Typography>
        <Typography variant="caption" color="textSecondary">
          {values.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

const NumberFormatCell = ({ value }: any) => (
  <PatternFormat
    displayType="text"
    format="+1 (###) ###-####"
    mask="_"
    defaultValue={value}
  />
);

const StatusCell = ({ value }: any) => {
  switch (value) {
    case "Complicated":
      return (
        <Chip color="error" label="Rejected" size="small" variant="light" />
      );
    case "Relationship":
      return (
        <Chip color="success" label="Verified" size="small" variant="light" />
      );
    case "Single":
    default:
      return <Chip color="info" label="Pending" size="small" variant="light" />;
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
            setCustomerDeleteId(row.values.fullName);
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

NumberFormatCell.propTypes = {
  value: PropTypes.string,
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

const TeamListPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const { customer: org } = location.state || {}; // fallback to empty object if not passed

  console.log("Customer org:", org?.id);

  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  console.log("allUsers", allUsers);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://pms-db-mock.onrender.com/Users")
      .then((res) => res.json())
      .then((allUsers) => {
        const filteredUsers = org?.id
          ? allUsers.filter((u: any) => u.orgId === org.id)
          : allUsers;
        setUsers(filteredUsers);
        setAllUsers(allUsers);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, [org]);

  useEffect(() => {
    fetch("https://pms-db-mock.onrender.com/Teams")
      .then((res) => res.json())
      .then((allTeams) => {
        const filteredTeams = org?.id
          ? allTeams.filter((t: any) => t.orgId === org.id)
          : allTeams;
        setTeams(filteredTeams);
      })
      .catch((err) => console.error("Failed to fetch teams:", err));
  }, [org]);

  // 🔑 Combine teams + users into table data
  useEffect(() => {
    if (teams.length) {
      const merged = teams.map((t: any) => {
        const teamLead = users.find(
          (u) => u.name === t.lead || u.fullName === t.lead
        );
        return {
          ...t,
          membersCount: t.members?.length || 0,
          lead: teamLead ? teamLead.name : t.lead, // fallback if no match
        };
      });
      setData(merged);
    }
  }, [teams, users]);

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
        accessor: "id",
        className: "cell-center",
      },
      {
        Header: "Team Name",
        accessor: "teamName",
        Cell: ({ value }: any) => (
          <Typography variant="subtitle1">{value}</Typography>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }: any) => (
          <Typography variant="body2" color="textSecondary">
            {value || "-"}
          </Typography>
        ),
      },
      {
        Header: "Team Lead",
        accessor: "lead",
        Cell: ({ value }: any) => (
          <Typography variant="body2">{value}</Typography>
        ),
      },
      {
        Header: "Members Count",
        accessor: "membersCount",
        className: "cell-center",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: any) => {
          switch (value) {
            case "Active":
              return <Chip color="success" label="Active" size="small" />;
            case "Inactive":
              return <Chip color="error" label="Inactive" size="small" />;
            default:
              return <Chip color="info" label="Pending" size="small" />;
          }
        },
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
    [theme]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: any) => {
      const team = row.original;
      const teamUsers = allUsers.filter((u) =>
        team.members?.includes(u.name || u.fullName)
      );
      return <TeamGridView data={teamUsers} />;
    },
    [users]
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
        PaperProps={{
          sx: { width: 500, p: 0, transition: "transform 225ms" }, // adjust width as needed
        }}
      >
        <AddTeam
          team={{ ...(customer || {}), orgId: org?.id }}
          onCancel={handleAdd}
          users={data}
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

export default TeamListPage;

import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import {
  Button,
  Chip,
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
} from "../../../components/third-party/ReactTable";

// assets
import {
  // CloseOutlined,
  PlusOutlined,
  // EyeTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import IconButton from "../../../components/@extended/IconButton";
import Avatar from "../../../components/@extended/Avatar";
import MainCard from "../../../components/MainCard";
import ScrollX from "../../../components/ScrollX";
import AlertOrganisationDelete from "../org/sections/AlertOrganizationDelete";
import { GlobalFilter, renderFilterTypes } from "../../../utils/react-table";
import AddTeam from "./sections/Teampage";
import TeamGridView from "./sections/TeamGridView";
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

// Example usage
// const avatarImage = avatarMap["avatar-1.png"];
// ==============================|| REACT TABLE ||============================== //

function ReactTable({
  columns,
  data,
  getHeaderProps,
  renderRowSubComponent,
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
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
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
            // size="small"
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
            {/* <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleAdd}
              size="small"
            >
              Add Teams
            </Button> */}
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
                      })}
                  </Fragment>
                );
              })
            )}

            {/* Pagination row */}
            <TableRow sx={{ "&:hover": { bgcolor: "transparent !important" } }}>
              <TableCell colSpan={visibleColumns.length}>
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
        <Chip color="error" label="Rejected" size="small" variant="outlined" />
      );
    case "Relationship":
      return (
        <Chip
          color="success"
          label="Verified"
          size="small"
          variant="outlined"
        />
      );
    case "Single":
    default:
      return (
        <Chip color="info" label="Pending" size="small" variant="outlined" />
      );
  }
};

const ActionCell = (
  row: any,
  setCustomer: any,
  setTeamToDelete: any,
  setOpenAlert: any,
  handleAdd: any,
  theme: any
) => {
  // const collapseIcon = row.isExpanded ? (
  //   <CloseOutlined style={{ color: theme.palette.error.main }} />
  // ) : (
  //   <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
  // );
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0}
    >
      {/* <Tooltip title="View">
        <IconButton
          color="secondary"
          onClick={(e: any) => {
            e.stopPropagation();
            row.toggleRowExpanded();
          }}
        >
          {collapseIcon}
        </IconButton>
      </Tooltip> */}
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
            setTeamToDelete(row.original);
            setOpenAlert(true);
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
  const [openAlert, setOpenAlert] = useState(false);
  const [teamToDelete] = useState<any>(null);

  const { customer: org } = location.state || {}; // fallback to empty object if not passed
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [_allUsers, setAllUsers] = useState<any[]>([]);
  // console.log("allUsers", allUsers);
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://pms-db-mock.onrender.com/Users");
        const allUsers = await res.json();

        const filteredUsers = org?.id
          ? allUsers.filter((u: any) => u.orgId === org.id)
          : allUsers;

        setUsers(filteredUsers);
        setAllUsers(allUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [org]);
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://pms-db-mock.onrender.com/Teams");
      const allTeams = await res.json();

      const filteredTeams = org?.id
        ? allTeams.filter((t: any) => t.orgId === org.id)
        : allTeams;

      setTeams(filteredTeams);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTeams();
  }, [org]);

  // Combine teams + users into table data
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
  // const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<any | null>(null);
  const [setCustomerDeleteId] = useState();

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  // const handleClose = () => {
  //   setOpen(!open);
  // };

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
        accessor: "orderby",
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
        Header: "Team Manager",
        accessor: "manager",
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
        Header: "Country",
        accessor: "country",
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
            setCustomer, // selected team (edit target)
            setCustomerDeleteId,
            setOpenAlert, // delete alert
            handleAdd, // <<< correct: this opens AddTeam
            theme
          ),
      },
    ],
    [theme]
  );

  const renderRowSubComponent = useCallback(() => {
    //  static mock data instead of API results
    const staticUsers = [
      {
        id: 1,
        name: "John Doe",
        fullName: "John Doe",
        email: "john@example.com",
        role: "Frontend Developer",
        avatar: avatarMap["avatar-1.png"],
      },
      {
        id: 2,
        name: "Sarah Connor",
        fullName: "Sarah Connor",
        email: "sarah@example.com",
        role: "UI/UX Designer",
        avatar: avatarMap["avatar-2.png"],
      },
      {
        id: 3,
        name: "Michael Scott",
        fullName: "Michael Scott",
        email: "michael@example.com",
        role: "Team Lead",
        avatar: avatarMap["avatar-3.png"],
      },
    ];

    // pick static users belonging to this team if needed
    // const team = row.original;
    // const filteredStaticUsers = staticUsers.filter((u) =>
    //   team.members?.includes(u.name)
    // );

    // ⬇️ pass them to the grid (use all or filtered)
    return (
      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <div
            style={{
              width: "100%",
              display: "block",
              padding: "20px",
              background: "#fff",
            }}
          >
            <TeamGridView data={staticUsers} />
          </div>
        </TableCell>
      </TableRow>
    );
  }, []);

  const handleAlertClose = () => {
    // Just close dialog — no delete action
    setOpenAlert(false);
  };

  return (
    <>
      {loading && <Loader />}
      {/* Title Section OUTSIDE MainCard */}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* Left side — Title */}
        <Stack spacing={0.5}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Organization Teams
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage and assign Teams within this organization
          </Typography>
        </Stack>

        {/* Right side — Add button */}
        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Team
        </Button>
      </Stack>
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
          title={teamToDelete?.teamName}
          message="This is a preview alert. Delete action is disabled."
          open={openAlert}
          handleClose={handleAlertClose}
        />

        {/* add user dialog */}
        <Dialog
          // anchor="right"
          open={add}
          onClose={handleAdd}
          PaperProps={{
            sx: { width: 700, p: 0, transition: "transform 225ms" },
          }}
        >
          <AddTeam
            team={{ ...(customer || {}), orgId: org?.id }}
            onCancel={handleAdd}
            users={data}
            onSave={async () => {
              await fetchTeams();
            }}
          />
        </Dialog>
      </MainCard>
    </>
  );
};

export default TeamListPage;

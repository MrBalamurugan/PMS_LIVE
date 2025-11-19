import React, { useMemo, Fragment, useState, useEffect } from "react";
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
  CircularProgress,
  useMediaQuery,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import type { Column, Row } from "react-table";

import { FileExcelTwoTone } from "@ant-design/icons";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

const API_URL = "https://pms-db-mock.onrender.com/Auditlog";

// ==============================|| TYPES ||============================== //

interface AuditLog {
  _id: string;
  timestamp: string;
  username: string;
  role: string;
  branchName: string;
  action: "CREATE" | "UPDATE" | "DEACTIVATE" | "REACTIVATE" | string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
}

// ==============================|| AUDIT LOGS TABLE VIEW ||============================== //

const AuditLogsTable: React.FC = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<AuditLog[]>([]);
  const [filteredData, setFilteredData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Filters
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 🔹 Fetch Audit Logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch audit logs");
        const logs: AuditLog[] = await response.json();
        setData(logs);
        setFilteredData(logs);
      } catch (err: any) {
        console.error("❌ Error fetching audit logs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // 🔹 Apply Filters
  useEffect(() => {
    let filtered = data;

    if (branchFilter) {
      filtered = filtered.filter((log) => log.branchName === branchFilter);
    }
    if (userFilter) {
      filtered = filtered.filter((log) =>
        log.username.toLowerCase().includes(userFilter.toLowerCase())
      );
    }
    if (startDate) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) <= new Date(endDate)
      );
    }

    setFilteredData(filtered);
  }, [branchFilter, userFilter, startDate, endDate, data]);

  // ---------- COLUMNS ----------
  const columns: Column<AuditLog>[] = useMemo(
    () => [
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "—"),
      },
      {
        Header: "User",
        accessor: "username",
        Cell: ({ row }) => (
          <Stack direction="column" spacing={0}>
            <Typography variant="body2" fontWeight={600}>
              {row.original.username || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.role || "—"}
            </Typography>
          </Stack>
        ),
      },
      {
        Header: "Branch",
        accessor: "branchName",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ value }) => {
          let color: "success" | "info" | "error" | "warning" | "default" =
            "default";
          switch (value) {
            case "CREATE":
              color = "success";
              break;
            case "UPDATE":
              color = "info";
              break;
            case "DEACTIVATE":
              color = "error";
              break;
            case "REACTIVATE":
              color = "warning";
              break;
          }
          return <Chip label={value || "—"} color={color} size="small" />;
        },
      },
      {
        Header: "Old Values",
        accessor: "oldValue",
        Cell: ({ value }) => (
          <pre
            style={{
              fontSize: "0.75rem",
              background: "#fafafa",
              padding: "1px",
              borderRadius: 4,
              overflowX: "auto",
              maxHeight: "150px",
            }}
          >
            {value ? JSON.stringify(value, null, 2) : "—"}
          </pre>
        ),
      },
      {
        Header: "New Values",
        accessor: "newValue",
        Cell: ({ value }) => (
          <pre
            style={{
              fontSize: "0.75rem",
              background: "#f0fff0",
              padding: "1px",
              borderRadius: 4,
              overflowX: "auto",
              maxHeight: "150px",
            }}
          >
            {value ? JSON.stringify(value, null, 2) : "—"}
          </pre>
        ),
      },
    ],
    [theme]
  );

  // ---------- REACT TABLE HOOKS ----------
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable<AuditLog>(
      {
        columns,
        data: filteredData,
      },
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect
    );

  // ---------- EXPORTS ----------
  const exportCSV = () => {
    const headers = [
      "Timestamp",
      "Username",
      "Role",
      "Branch",
      "Action",
      "Old Value",
      "New Value",
    ];
    const csvData = filteredData.map((log) => [
      log.timestamp,
      log.username,
      log.role,
      log.branchName,
      log.action,
      JSON.stringify(log.oldValue),
      JSON.stringify(log.newValue),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvData.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "audit_logs.csv";
    link.click();
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Audit Logs", 14, 15);
  //   (doc as any).autoTable({
  //     head: [["Timestamp", "User", "Role", "Branch", "Action"]],
  //     body: filteredData.map((log) => [
  //       new Date(log.timestamp).toLocaleString(),
  //       log.username,
  //       log.role,
  //       log.branchName,
  //       log.action,
  //     ]),
  //     startY: 20,
  //   });
  //   doc.save("audit_logs.pdf");
  // };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Loading audit logs...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
        <Typography variant="body2" color="error">
          ❌ Failed to load audit logs: {error}
        </Typography>
      </Stack>
    );
  }

  const uniqueBranches = Array.from(
    new Set(data.map((d) => d.branchName))
  ).filter(Boolean);
  const uniqueUsers = Array.from(new Set(data.map((d) => d.username))).filter(
    Boolean
  );

  return (
    <Stack spacing={2}>
      {/* ---------- FILTERS ---------- */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={matchDownSM ? "column" : "row"}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction={matchDownSM ? "column" : "row"} spacing={2}>
            <TextField
              select
              label="Branch"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueBranches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="User"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
              select
            >
              <MenuItem value="">All</MenuItem>
              {uniqueUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileExcelTwoTone />}
              onClick={exportCSV}
            >
              Export CSV
            </Button>
            {/* <Button
              variant="contained"
              color="error"
              startIcon={<FilePdfTwoTone />}
              onClick={exportPDF}
            >
              Export PDF
            </Button> */}
          </Stack>
        </Stack>
      </Paper>

      {/* ---------- TABLE ---------- */}
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                sx={{ bgcolor: "#f5f5f5" }}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(
                      (column as any).getSortByToggleProps?.()
                    )}
                  >
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<AuditLog>) => {
                prepareRow(row);
                return (
                  <Fragment key={row.original._id}>
                    <TableRow {...row.getRowProps()} hover>
                      {row.cells.map((cell) => (
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
                  <Typography variant="body2" color="text.secondary">
                    No audit logs available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AuditLogsTable;

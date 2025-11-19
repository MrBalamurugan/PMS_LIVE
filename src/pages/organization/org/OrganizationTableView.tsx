import React, { useMemo, Fragment, useState, useCallback } from "react";
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
  // Chip,
  Tooltip,
  // Button,
  // useMediaQuery,
} from "@mui/material";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import {
  DeleteTwoTone,
  EditTwoTone,
  // EyeTwoTone,
  // CloseOutlined,
} from "@ant-design/icons";
import IconButton from "../../../components/@extended/IconButton";
import Avatar from "../../../components/@extended/Avatar";
// import { contactcode } from "../../../utils/staticData";

interface OrganizationTableViewProps {
  data: any[];
  onDelete: (id: number) => void;
  onEdit?: (org: any) => void;
}
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

const OrganizationTableView: React.FC<OrganizationTableViewProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedRow] = useState<number | null>(null);

  const columns = useMemo(
    () => [
      {
        Header: "Organization",
        accessor: "companyName",
        Cell: ({ row }: any) => {
          const org = row.original;
          const avatarSrc = org.logo
            ? org.logo
            : avatarMap[`avatar-${org.avatar ?? 1}.png`];

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                alt={org.companyName}
                src={avatarSrc}
                sx={{ width: 40, height: 40 }}
              />
              <Typography>{org.companyName}</Typography>
            </Stack>
          );
        },
      },
      {
        Header: "Type",
        accessor: "fatherName",
        Cell: ({ value }: any) => <Typography>{value || "—"}</Typography>,
      },
      {
        Header: "Branches",
        accessor: "branches",
        Cell: ({ value }: any) => <Typography>{value ?? 3}</Typography>,
      },
      {
        Header: "Projects",
        accessor: "projects",
        Cell: ({ value }: any) => <Typography>{value ?? 2}</Typography>,
      },
      {
        Header: "Location",
        accessor: "country",
        Cell: ({ value }: any) => <Typography>{value || "—"}</Typography>,
      },
      {
        Header: "E-Mail",
        accessor: "email",
      },
      {
        Header: "Action",
        accessor: "actions",

        disableSortBy: true,
        Cell: ({ row }: any) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            {/* <Tooltip title="View">
              <IconButton
                color="secondary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setExpandedRow(expandedRow === row.index ? null : row.index);
                }}
              >
                {expandedRow === row.index ? (
                  <CloseOutlined style={{ color: theme.palette.error.main }} />
                ) : (
                  <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                )}
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onEdit && onEdit(row.original);
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
                  onDelete(row.original.id);
                }}
              >
                <DeleteTwoTone twoToneColor={theme.palette.error.main} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [expandedRow, onDelete, onEdit, theme]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // state,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 } as any,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  ) as any;

  const renderRowSubComponent = useCallback(
    ({ row }: any) => (
      <TableRow>
        <TableCell colSpan={6} sx={{ bgcolor: "#f9f9f9" }}>
          <Typography variant="body2">
            Additional details for {row.original.companyName}
          </Typography>
        </TableCell>
      </TableRow>
    ),
    []
  );

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
                <Fragment key={row.index}>
                  <TableRow
                    {...row.getRowProps()}
                    hover
                    sx={{ cursor: "pointer" }}
                  >
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
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">
                  No organization data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrganizationTableView;

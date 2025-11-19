import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// third-party
import { useTable, useSortBy } from "react-table";
import { useSticky } from "react-table-sticky";

// project import
import MainCard from "../../../../components/MainCard";
import ScrollX from "../../../../components/ScrollX";
import {
  // CSVExport,
  HeaderSort,
} from "../../../../components/third-party/ReactTable";
import { ThemeMode } from "../../../../config";

// ==============================|| REACT TABLE ||============================== //

// table style
const TableWrapper = styled("div")(() => ({
  ".header": {
    position: "sticky",
    zIndex: 1,
    width: "fit-content",
  },
  "& th[data-sticky-td]": {
    position: "sticky",
    zIndex: "5 !important",
  },
}));

function ReactTable({ columns, data, getHeaderProps, title }: any) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 80,
      width: 100,
      maxWidth: 400,
    }),
    []
  );
  const theme = useTheme();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useSortBy,
      useSticky
    );

  const sortingRow = rows.slice(0, 19);
  let sortedData = sortingRow.map((d) => d.original);
  Object.keys(sortedData).forEach(
    (key) =>
      sortedData[Number(key)] === undefined && delete sortedData[Number(key)]
  );

  return (
    <MainCard
      title={title}
      content={false}
      // secondary={
      //   <CSVExport
      //     data={sortedData}
      //     filename={
      //       title === "Sticky Header"
      //         ? "sticky-header-table.csv"
      //         : "sticky-column-table.csv"
      //     }
      //   />
      // }
    >
      <ScrollX
        sx={{
          height: 500,
          "&::-webkit-scrollbar": {
            height: 6,
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bfbfbf",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <TableWrapper>
          <Table {...getTableProps()} stickyHeader>
            <TableHead>
              {headerGroups.map((headerGroup: any) => (
                <TableRow
                  key={headerGroup.id}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column: any) => {
                    return (
                      <TableCell
                        key={column.id}
                        sx={{ position: "sticky !important" }}
                        {...column.getHeaderProps([
                          { className: column.className },
                          getHeaderProps(column),
                        ])}
                      >
                        <HeaderSort column={column} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {sortingRow.map((row: any) => {
                prepareRow(row);
                return (
                  <TableRow key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                      return (
                        <TableCell
                          key={cell.column.id}
                          sx={{
                            backgroundColor:
                              theme.palette.mode === ThemeMode.DARK
                                ? theme.palette.grey[100]
                                : theme.palette.common.white,
                          }}
                          {...cell.getCellProps([
                            { className: cell.column.className },
                          ])}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableWrapper>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  title: PropTypes.string,
};

// ==============================|| REACT TABLE - STICKY ||============================== //

const ProjectTable = ({ columns, data, title }: any) => {
  return (
    <ReactTable
      columns={columns}
      data={data}
      title={title}
      getHeaderProps={(column) => column.getSortByToggleProps()}
    />
  );
};

ProjectTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  title: PropTypes.string,
};

export default ProjectTable;

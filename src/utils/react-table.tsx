import PropTypes from "prop-types";

import { useMemo, useState } from "react";

// material-ui
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "regenerator-runtime/runtime";

// third-party
import { format } from "date-fns";

// assets
import { CloseOutlined, LineOutlined, SearchOutlined } from "@ant-design/icons";
import IconButton from "../components/@extended/IconButton";
import { useAsyncDebounce } from "react-table";
import { matchSorter } from "match-sorter";

export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  placeholder = undefined,
  ...other
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value: any) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <OutlinedInput
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={placeholder || `Search ${count} records...`}
      id="start-adornment-email"
      startAdornment={<SearchOutlined />}
      {...other}
    />
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
};

export function DateColumnFilter({ column: { filterValue, setFilter } }: any) {
  return (
    <FormControl sx={{ width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={filterValue ? new Date(filterValue) : null}
          onChange={(value) => {
            const newValue = value as Date | null; // cast to raw Date

            if (newValue) {
              const formatted = format(newValue, "M/d/yyyy");
              setFilter(formatted);
            } else {
              setFilter(undefined);
            }
          }}
        />
      </LocalizationProvider>
    </FormControl>
  );
}

DateColumnFilter.propTypes = {
  column: PropTypes.object,
};

export function DefaultColumnFilter({
  column: { filterValue, Header, setFilter },
}: any) {
  return (
    <TextField
      fullWidth
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={Header}
      size="small"
    />
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
};

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  const options = useMemo<string[]>(() => {
    const opts = new Set<string>();
    preFilteredRows.forEach((row: any) => {
      opts.add(row.values[id]);
    });
    return Array.from(opts);
  }, [id, preFilteredRows]);

  return (
    <Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      displayEmpty
      size="small"
    >
      <MenuItem value="">All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

SelectColumnFilter.propTypes = {
  column: PropTypes.object,
};

export function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ pl: 1, minWidth: 120 }}
    >
      <Slider
        value={filterValue || min}
        min={min}
        max={max}
        step={1}
        onChange={(newValue) => {
          setFilter(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
      <Tooltip title="Reset">
        <IconButton
          size="small"
          color="error"
          onClick={() => setFilter(undefined)}
        >
          <CloseOutlined />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

SliderColumnFilter.propTypes = {
  column: PropTypes.object,
};

export function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: any) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ minWidth: 168, maxWidth: 250 }}
    >
      <TextField
        fullWidth
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
        size="small"
      />
      <LineOutlined />
      <TextField
        fullWidth
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Max (${max})`}
        size="small"
      />
    </Stack>
  );
}

NumberRangeColumnFilter.propTypes = {
  column: PropTypes.object,
};

function fuzzyTextFilterFn(rows: any, id: any, filterValue: any) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]],
  });
}

fuzzyTextFilterFn.autoRemove = (val: any) => !val;

export const renderFilterTypes = () => ({
  fuzzyText: fuzzyTextFilterFn,
  text: (rows: any, id: any, filterValue: any) => {
    rows.filter((row: any) => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true;
    });
  },
});
export function filterGreaterThan(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val: any) => typeof val !== "number";

export function useControlledState(state: any) {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      };
    }
    return state;
  }, [state]);
}

export function roundedMedian(leafValues: any) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value: any) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

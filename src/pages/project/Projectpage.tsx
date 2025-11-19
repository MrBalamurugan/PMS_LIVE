import PropTypes from "prop-types";
import { useMemo, useState } from "react";

// material-ui
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
// project import
import Avatar from "../../components/@extended/Avatar";
import LinearWithLabel from "../../components/@extended/progress/LinearWithLabel";
import ReactTable from "../organization/project/sections/ProjectTable";

// const avatarImage = require.context("../../assets/images/users", true);

// ==============================|| REACT TABLE - STICKY ||============================== //

const Address = ({ value }: any) => <Box sx={{ minWidth: 200 }}>{value}</Box>;

Address.propTypes = {
  value: PropTypes.string,
};
const CellProgress = ({ value }: any) => {
  const color = getProgressColor(value);

  return <LinearWithLabel value={value} color={color} sx={{ minWidth: 75 }} />;
};

CellProgress.propTypes = {
  value: PropTypes.number,
};
const ActionCell = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // console.log("Edit clicked", row.original);
    handleClose();
  };

  const handleDelete = () => {
    // console.log("Delete clicked", row.original);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

//Progress
// const CellProgress = ({ value }: any) => (
//   <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
// );

CellProgress.propTypes = {
  value: PropTypes.number,
};

const CellAvatar = () => (
  <Avatar alt="Avatar 1" size="sm" src="../../assets/images/users" />
);

CellAvatar.propTypes = {
  value: PropTypes.number,
};

const getProgressColor = (value: number) => {
  if (value <= 25) return "error";
  if (value <= 50) return "warning";
  if (value <= 75) return "info";
  return "success";
};

const CustomCell = ({ row }: any) => {
  const project = row.original;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        alt={project.name}
        size="sm"
        src={project.image}
        sx={{
          width: 40,
          height: 40,
          border: "1px solid #ddd",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <Stack spacing={0}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {project.units} Units
        </Typography>
      </Stack>
    </Stack>
  );
};

CustomCell.propTypes = {
  row: PropTypes.object,
};
// Status
const StatusCell = ({ value }: any) => {
  switch (value) {
    case "Under Construction":
      return (
        <Chip
          color="error"
          label="Under Construction"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );

    case "Completed":
      return (
        <Chip
          color="success"
          label="Completed"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );

    case "In Planning Phase":
      return (
        <Chip
          color="info"
          label="In Planning Phase"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );

    case "In Design Phase":
      return (
        <Chip
          color="warning"
          label="In Design Phase"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );

    default:
      return (
        <Chip color="default" label={value} size="small" variant="outlined" />
      );
  }
};

const Typecell = ({ value }: any) => {
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        backgroundColor: "#F3F4F6",
        color: "gray",
        fontWeight: 600,
      }}
    />
  );
};

Typecell.propTypes = {
  value: PropTypes.array,
};

StatusCell.propTypes = {
  value: PropTypes.string,
};

const ProjectPage = ({ data }: any) => {
  // console.log("dataColumns", data);
  const columns = useMemo(
    () => [
      {
        Header: "Project",
        accessor: "name",
        Cell: CustomCell,
      },
      {
        Header: "Code",
        accessor: "code",
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: Typecell,
      },
      {
        Header: "Branch",
        accessor: "branch",
        // className: "cell-right",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Towers",
        accessor: "towers",
        className: "cell-right",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusCell,
      },
      // {
      //   Header: "Profile Progress",
      //   accessor: "completion",
      //   Cell: CellProgress,
      // },
      {
        Header: "",
        accessor: "actions",
        Cell: ActionCell,
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReactTable
          // title="Sticky Header"
          columns={columns}
          data={data}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectPage;

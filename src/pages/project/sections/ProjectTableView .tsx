import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectTableView = ({ data, onDelete }: any) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ background: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Completion</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.type}</TableCell>
              <TableCell>{project.branch}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>{project.completion}%</TableCell>

              <TableCell align="center">
                <IconButton color="error" onClick={() => onDelete(project.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTableView;

/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Box,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";

import units from "../../../../assets/images/png/Layers Minimalistic.png";
import build from "../../../../assets/images/png/Buildings 2.png";
import location from "../../../../assets/images/png/map-arrow-square.png";
import rocket from "../../../../assets/images/png/Rocket.png";

interface ProjectCardProps {
  project: any;
  onDelete: (id: string) => void;
  comname?: string;
}
const statusColors: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#d1f7c4", color: "#2e7d32" }, // green
  "Under Construction": { bg: "#fff4c2", color: "#b28704" },
  "In Planning Phase": { bg: "#ffe0e0", color: "#d32f2f" },
  "In Design Phase": { bg: "#dbe7ff", color: "#1e40af" },
  "On Hold": { bg: "#f0e6ff", color: "#6a1b9a" },
};
const getProgressColor = (value: number) => {
  if (value <= 25) return "error"; // red
  if (value <= 50) return "warning"; // yellow/orange
  if (value <= 75) return "info"; // blue
  return "success"; // green
};
const ProjectCard = ({ project }: ProjectCardProps) => {
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const openMenu = Boolean(anchorEl);

  // const handleMenuClick = (event: any) => setAnchorEl(event.currentTarget);
  // const handleMenuClose = () => setAnchorEl(null);

  // const handleDelete = () => {
  //   handleMenuClose();
  //   if (onDelete) onDelete(project.id);
  // };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {project.image && (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 160,
            "& img": {
              transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              transformOrigin: "center center",
            },
            "&:hover img": {
              transform: "scale(1.06)",
            },
          }}
        >
          <CardMedia
            component="img"
            height="160"
            image={project.image}
            alt={project.name}
          />

          {/* Top-right Chip */}
          <Chip
            label={project.status}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              fontWeight: 600,
              borderRadius: 20,
              backgroundColor: statusColors[project.status]?.bg || "#e0e0e0",
              color: statusColors[project.status]?.color || "#000",
              px: 1.2,
            }}
          />
        </Box>
      )}

      <CardContent>
        <Stack spacing={1} padding={1}>
          {/* Project Name */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <ApartmentIcon fontSize="medium" sx={{ color: "#075cd4ff" }} />
            <Typography variant="h4">{project.name}</Typography>
          </Stack>

          {/* NEW LINES: Project Code + Branch Code */}
          {/* Project Code + Residential Chip */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              sx={{
                color: "#767676ff",
              }}
            >
              <strong>Project Code:</strong> {project.code}
            </Typography>

            <Chip
              label="Residential"
              // color="primary"
              // variant="outlined"
              size="small"
              sx={{
                fontWeight: 600,
                borderRadius: 20,
                backgroundColor: "#f0efefff",
                padding: 1,
                color: "grey",
              }}
            />
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: "#767676ff",
            }}
          >
            <strong>Branch Code:</strong> {project.branchCode || "BR-1003"}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={location}
              alt="Location"
              sx={{ width: 20, height: 20 }}
            />
            <Typography variant="body2" sx={{ color: "#767676ff" }}>
              {project.location}
            </Typography>
          </Stack>
          {/* Completion section */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.5, color: "#767676ff" }}
            >
              <Typography variant="body2">Completion</Typography>

              <Typography variant="body2" fontWeight={600}>
                {project.completion}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              color={getProgressColor(project.completion)}
              value={project.completion}
            />
          </Box>

          {/* NEW: Towers & Units row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              color: "#636363ff",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src={build}
                alt="Location"
                sx={{ width: 20, height: 20 }}
              />{" "}
              <Typography variant="body2">{project.towers} Towers</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src={units}
                alt="Location"
                sx={{ width: 20, height: 20 }}
              />{" "}
              <Typography variant="body2">{project.units} Units</Typography>
            </Stack>
          </Stack>

          <Divider />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={rocket}
              alt="Location"
              sx={{ width: 20, height: 20 }}
            />{" "}
            <Typography variant="body2" sx={{ color: "#767676ff" }}>
              Launched on 19/12/24
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
};

export default ProjectCard;

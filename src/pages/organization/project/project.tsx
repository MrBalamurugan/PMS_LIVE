/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  // Drawer,
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Typography,
  Dialog,
  Divider,
} from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useLocation } from "react-router-dom";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import GridViewIcon from "@mui/icons-material/GridView";
import usePagination from "../../../hooks/usePagination";
import { GlobalFilter } from "../../../utils/react-table";
import EmptyUserCard from "../../../components/cards/skeleton/EmptyUserCard";
import ProjectCard from "./sections/ProjectCard";
import AddProject from "../../project/sections/AddProject";
import Loader from "../../../components/Loader";
import IconButton from "../../../components/@extended/IconButton";
// import ProjectTableView from "../../project/sections/ProjectTableView ";
import Sticky from "../../project/Projectpage";

// ==============================|| PROJECT - CARD PAGE ||============================== //

const sortOptions = [
  { id: 1, header: "Default" },
  { id: 2, header: "Project Name" },
  { id: 3, header: "Status" },
  { id: 4, header: "Completion" },
  { id: 5, header: "Location" },
  { id: 6, header: "Type" },
  { id: 7, header: "Branch" },
];

const Project = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("Default");
  const [globalFilter, setGlobalFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const location = useLocation();
  const { customer: org } = location.state || {};

  const matchDownSM = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

  const PER_PAGE = 6;
  const _DATA = usePagination(projects, PER_PAGE);
  // const count = Math.ceil(projects.length / PER_PAGE);

  const API_URL = "https://pms-db-mock.onrender.com/Projects";

  // --------------------- Fetch Projects ---------------------
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);

      let data = res.data.map((proj: any) => ({
        id: proj.id,
        name: proj.name,
        code: proj.code,
        type: proj.type,
        branch: proj.branch,
        location: proj.location,
        status: proj.status,
        completion: proj.completion,
        towers: proj.towers,
        units: proj.units,
        launchDate: proj.launchDate,
        image: proj.image,
      }));

      if (org?.id) {
        data = data.filter((p: any) => p.OrgId === org.id);
      }

      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
    if (selectedProject && !drawerOpen) setSelectedProject(null);
  };

  const handleSave = () => {
    fetchProjects();
    setDrawerOpen(false);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const sortData = (a: any, b: any) => {
    switch (sortBy) {
      case "Project Name":
        return a.name.localeCompare(b.name);
      case "Status":
        return a.status.localeCompare(b.status);
      case "Completion":
        return b.completion - a.completion;
      case "Location":
        return a.location.localeCompare(b.location);
      case "Type":
        return a.type.localeCompare(b.type);
      case "Branch":
        return a.branch.localeCompare(b.branch);
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (globalFilter) {
      const filtered = projects.filter((p: any) =>
        p.name.toLowerCase().includes(globalFilter.toLowerCase())
      );
      setProjects(filtered);
    } else {
      fetchProjects();
    }
  }, [globalFilter]);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      {loading && <Loader />}

      {/* Main wrapper with bottom padding */}
      <Box sx={{ pb: 2 }}>
        {/* HEADER */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Projects
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Manage your Project structure and Properties
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => navigate("/project/addproject")}
          >
            Add Project
          </Button>
        </Stack>

        {/* FILTER & SORT BAR */}
        <Box sx={{ position: "relative", marginBottom: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <GlobalFilter
              preGlobalFilteredRows={projects}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />

            <Stack
              direction={matchDownSM ? "column" : "row"}
              alignItems="center"
              spacing={1}
            >
              <FormControl sx={{ m: 1, minWidth: 140 }}>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? (
                      <Typography variant="subtitle2">
                        Sort by ({selected})
                      </Typography>
                    ) : (
                      <Typography variant="subtitle1">Sort By</Typography>
                    )
                  }
                >
                  {sortOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.header}>
                      {opt.header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Divider */}
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />

              {/* View Icons */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => setViewMode("card")}
                  sx={{
                    bgcolor:
                      viewMode === "card"
                        ? "rgba(33, 150, 243, 0.15)"
                        : "transparent", // light blue background
                    color:
                      viewMode === "card" ? "primary.main" : "text.secondary",
                    "&:hover": {
                      bgcolor: "rgba(33, 150, 243, 0.25)", // slightly darker on hover
                    },
                  }}
                >
                  <ViewModuleIcon />
                </IconButton>

                <IconButton
                  onClick={() => setViewMode("grid")}
                  sx={{
                    bgcolor:
                      viewMode === "grid"
                        ? "rgba(33, 150, 243, 0.15)"
                        : "transparent",
                    color:
                      viewMode === "grid" ? "primary.main" : "text.secondary",
                    "&:hover": {
                      bgcolor: "rgba(33, 150, 243, 0.25)",
                    },
                  }}
                >
                  <GridViewIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* ====================== SCROLLABLE GRID ====================== */}
        {viewMode === "card" ? (
          <Box
            sx={{
              maxHeight: "55vh",
              overflowY: "auto",
              pr: 1,
              pb: 3,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#06ea06ff" },
            }}
          >
            <Grid container spacing={6}>
              {projects.length > 0 ? (
                _DATA
                  .currentData()
                  .sort(sortData)
                  .map((project: any, index: number) => (
                    <Slide
                      key={project.id || index}
                      direction="up"
                      in
                      timeout={100}
                    >
                      <Grid item xs={12} sm={6} lg={4}>
                        <Box sx={{ mb: 1 }}>
                          <ProjectCard
                            project={project}
                            onDelete={handleDelete}
                            comname={org?.companyName}
                          />
                        </Box>
                      </Grid>
                    </Slide>
                  ))
              ) : (
                <EmptyUserCard title="You have not created any project yet." />
              )}
            </Grid>
          </Box>
        ) : viewMode === "grid" ? (
          <Box
            sx={{
              maxHeight: "55vh",
              overflowY: "hidden",
              pr: 1,
              pb: 3,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: "6px" },
            }}
          >
            <Sticky data={projects} onDelete={handleDelete} />
          </Box>
        ) : null}
      </Box>

      {/* DRAWER FOR ADD/EDIT */}
      <Dialog
        // anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: { xs: "100%", sm: "60%" } },
        }}
      >
        <AddProject
          project={selectedProject}
          onCancel={handleDrawerToggle}
          onSave={handleSave}
        />
      </Dialog>
    </>
  );
};

export default Project;

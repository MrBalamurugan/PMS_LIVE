// OrganizationMainPage.jsx
import { useState } from "react";
import { Dialog } from "@mui/material";
import {
  Card,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Button,
} from "@mui/material";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ProjectsTable from "../../project/sections/ProjectsTable";
import BranchesTable from "../branch/sections/BranchesTable";
import BranchForm from "../branch/sections/BranchForm";
import StaticProjectView from "../../project/sections/AddNewProject";
import { useLocation } from "react-router-dom";

// Sample Components (replace with your actual pages)
const BranchList = ({ onEditBranch, orgId }: any) => (
  <BranchesTable onEditBranch={onEditBranch} orgId={orgId} />
);
const ProjectList = ({ onEditProject, orgId }: any) => (
  <ProjectsTable onEditProject={onEditProject} orgId={orgId} />
);
function a11yProps(index: any) {
  return {
    id: `org-tab-${index}`,
    "aria-controls": `org-tabpanel-${index}`,
  };
}

const OrganizationMainPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenForm = (type: any, item = null) => {
    setFormType(type);
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(null);
  };
  const location = useLocation();

  const customer = location.state?.customer;
  console.log("customer", customer?.id);
  customer.established = "Established, 2005";
  customer.status = "Active";
  // Sample organization data
  const organizationData = customer || {
    logo: "https://via.placeholder.com/80",
    name: "TechCorp Solutions",
    businessType: "Real Estate",
    status: "Active",
    address: "123 Innovation Drive, Silicon Valley, CA",
    email: "contact@techcorp.com",
    established: "Established, 2005",
    country: "USA",
    timeZone: "PST",
  };

  const details = [
    { value: organizationData.address, icon: <LocationOnIcon /> },
    { value: organizationData.email, icon: <EmailIcon /> },
    { value: organizationData.established, icon: <CalendarTodayIcon /> },
    { value: organizationData.country, icon: <PublicIcon /> },
    { value: organizationData.timeZone, icon: <AccessTimeIcon /> },
  ];

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ============== ORGANIZATION OVERVIEW CARD ============== */}
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          p: 2,
          mb: 3,
        }}
      >
        {/* Left: Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: { xs: 0, sm: 3 },
            mb: { xs: 2, sm: 0 },
            minWidth: 100,
          }}
        >
          <Avatar
            src={organizationData.logo}
            alt={organizationData.name}
            sx={{ width: { xs: 100, sm: 140 }, height: { xs: 100, sm: 140 } }}
          />
        </Box>

        {/* Right: Info */}
        <Box sx={{ flex: 1, marginLeft: 3 }}>
          {/* Top Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2,
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {customer?.companyName || organizationData.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {customer?.fatherName || organizationData.businessType}
              </Typography>
            </Box>

            {/* Status Chip */}
            <Chip
              label={customer?.status || organizationData.status}
              size="small"
              sx={{
                bgcolor:
                  organizationData.status === "Active"
                    ? "success.main"
                    : "error.main",
                color: "white",
                mt: { xs: 1, sm: 0 },
              }}
            />
          </Box>

          {/* Details Grid */}
          <Grid container columnSpacing={1} rowSpacing={2}>
            {details.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                  <Typography variant="body2">{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* ============== TABS SECTION ============== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Tabs wrapped in a flex-grow Box so they take available space */}
        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="organization tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Branches" {...a11yProps(0)} />
            <Tab label="Projects" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Add Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => handleOpenForm(value === 0 ? "branch" : "project")}
        >
          {value === 0 ? "Add Branch" : "Add Project"}
        </Button>

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="sm"
          fullWidth
        >
          {formType === "branch" && (
            <BranchForm
              item={selectedItem}
              OrgId={customer?.id}
              onCancel={handleCloseForm}
              onSave={(_newItem) => {
                // console.log("Saved branch:", newItem);
                handleCloseForm();
              }}
            />
          )}

          {formType === "project" && (
            <StaticProjectView
              item={selectedItem}
              OrgId={customer?.id}
              onCancel={handleCloseForm}
            />
          )}
        </Dialog>
      </Box>

      {/* Tab Panels */}
      {value === 0 && (
        <BranchList onEditBranch={handleOpenForm} orgId={customer?.id} />
      )}
      {value === 1 && (
        <ProjectList
          onEditProject={(item: any) => handleOpenForm("project", item)}
          orgId={customer?.id}
        />
      )}
    </Box>
  );
};

export default OrganizationMainPage;

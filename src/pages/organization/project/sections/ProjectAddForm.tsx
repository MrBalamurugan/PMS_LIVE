// OrganizationMainPage.jsx
import { useState } from "react";
import { Stack } from "@mui/material";
import {
  // Card,
  Typography,
  Box,
  // Grid,
  // Avatar,
  // Chip,
  Tab,
  Tabs,
  Button,
} from "@mui/material";

// Icons
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import EmailIcon from "@mui/icons-material/Email";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import PublicIcon from "@mui/icons-material/Public";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { useLocation } from "react-router-dom";
import Loader from "../../../../components/Loader";
import ProjectOverview from "./steps/ProjectOverview";
import ProjectAttributes from "./steps/ProjectAttributes";
import Financials from "./steps/Financials";
import Marketing from "./steps/Marketing";
import Settings from "./steps/Settings";

// Sample Components (replace with your actual pages)

function a11yProps(index: any) {
  return {
    id: `org-tab-${index}`,
    "aria-controls": `org-tabpanel-${index}`,
  };
}

const ProjectAddForm = () => {
  //   const customer = location.state?.customer;
  //   customer.established = "Established, 2005";
  //   customer.status = "Active";
  // Sample organization data
  // const organizationData = {
  //   logo: "https://via.placeholder.com/80",
  //   name: "TechCorp Solutions",
  //   businessType: "Real Estate",
  //   status: "Active",
  //   address: "123 Innovation Drive, Silicon Valley, CA",
  //   email: "contact@techcorp.com",
  //   established: "Established, 2005",
  //   country: "USA",
  //   timeZone: "PST",
  // };

  // const details = [
  //   { value: organizationData.address, icon: <LocationOnIcon /> },
  //   { value: organizationData.email, icon: <EmailIcon /> },
  //   { value: organizationData.established, icon: <CalendarTodayIcon /> },
  //   { value: organizationData.country, icon: <PublicIcon /> },
  //   { value: organizationData.timeZone, icon: <AccessTimeIcon /> },
  // ];

  const [value, setValue] = useState(0);
  const [loading] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      {loading && <Loader />}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Add New Project
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Add your Project structure and Properties
          </Typography>
        </Stack>
      </Stack>

      <Box>
        {/* ============== TABS SECTION ============== */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, backgroundColor: "#fcfcfcff" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="organization tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Project Overview" {...a11yProps(0)} />
              <Tab label="Project Attributes" {...a11yProps(1)} />
              <Tab label="Financials & Compliance" {...a11yProps(2)} />
              <Tab label="Marketing & Media" {...a11yProps(3)} />
              <Tab label="Settings & Flags" {...a11yProps(4)} />
            </Tabs>
          </Box>
        </Box>

        {/* Tab Panels */}
        {value === 0 && <ProjectOverview />}
        {value === 1 && <ProjectAttributes />}
        {value === 2 && <Financials />}
        {value === 3 && <Marketing />}
        {value === 4 && <Settings />}

        {/* Divider */}
        <Box sx={{ borderTop: "1px solid #e0e0e0", mt: 3, pt: 2 }} />

        {/* Back / Next Buttons */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: 2 }}
        >
          <Button
            variant="outlined"
            disabled={value === 0}
            onClick={() => setValue((prev) => prev - 1)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            disabled={value === 4}
            onClick={() => setValue((prev) => prev + 1)}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ProjectAddForm;

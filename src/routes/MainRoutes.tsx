import { lazy } from "react";

// project import
import MainLayout from "../layout/MainLayout";
import CommonLayout from "../layout/CommonLayout";
import Loadable from "../components/Loadable";
import AddPropertyStepper from "../pages/app/project/property-add/AddPropertyStepper";
import AuthGuard from "../utils/route-guard/AuthGuard";

import Projectpage from "../pages/project/Projectpage";
import UserPage from "../pages/organization/user/UserPage";
import TabRole from "../pages/organization/role/userrole";

// import Userpage from "../pages/user/userpage";
// import Teampage from "../sections/team/Teampage";
import TeamListPage from "../pages/organization/team/teamlist";
import Project from "../pages/organization/project/project";
import OrganizationDashboard from "../pages/dashboard/OrganizationDashboard";

// import SalesMainPage from "../pages/sales/SalesMainPage";
// import PlannerMainPage from "../pages/sales/Planner&Task/PlannerMainPage";
import OrganizationOverView from "../pages/organization/org/organizationoverview";
import AuditLogPage from "../pages/AuditLogPage";
import ProjectAddForm from "../pages/organization/project/sections/ProjectAddForm";

// pages routing
const MaintenanceError = Loadable(
  lazy(() => import("../pages/maintenance/404"))
);
const MaintenanceError500 = Loadable(
  lazy(() => import("../pages/maintenance/500"))
);
const MaintenanceUnderConstruction = Loadable(
  lazy(() => import("../pages/maintenance/under-construction"))
);
const MaintenanceComingSoon = Loadable(
  lazy(() => import("../pages/maintenance/coming-soon"))
);

// render - sample page
const SamplePage = Loadable(
  lazy(() => import("../pages/organization/branch/sample-page"))
);

const Properties = Loadable(
  lazy(() => import("../pages/app/project/property/Properties"))
);
const AddProperty = Loadable(
  lazy(() => import("../pages/app/project/property-add/AddProperty"))
);
const PropertyDetail = Loadable(
  lazy(() => import("../pages/app/project/property-detail/PropertyDetails"))
);

const Organisation = Loadable(
  lazy(() => import("../pages/organization/org/organisation"))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: "dashboard",
          element: <OrganizationDashboard />,
        },
        {
          path: "project",
          element: <Project />,
        },
        {
          path: "organization",
          element: <Organisation />,
        },
        {
          path: "organizationoverview",
          element: <OrganizationOverView />,
        },
        {
          path: "settings",
          element: <Projectpage />,
        },
        {
          path: "organization/users",
          element: <UserPage />,
        },
        {
          path: "organization/teams",
          element: <TeamListPage />,
        },
        {
          path: "organization/roles",
          element: <TabRole />,
        },
        {
          path: "lead",
          element: <SamplePage />,
        },
        {
          path: "project/property/add",
          element: <AddProperty />,
          children: [
            {
              path: "details",
              element: <AddPropertyStepper />,
            },
          ],
        },
        {
          path: "project/property/detail/:id",
          element: <PropertyDetail />,
        },
        {
          path: "project",
          element: <Project />,
        },
        {
          path: "project/addproject",
          element: <ProjectAddForm />,
        },
        {
          path: "organizationoverview/auditlog",
          element: <AuditLogPage />,
        },
        {
          path: "organization",
          element: <Organisation />,
        },
        {
          path: "setting",
          element: <Projectpage />,
        },

        {
          path: "/usermanagement/users",
          element: <UserPage />,
        },
        {
          path: "/usermanagement/teams",
          element: <TeamListPage />,
        },
        {
          path: "/usermanagement/roles",
          element: <TabRole />,
        },
        {
          path: "organization/users",
          element: <UserPage />,
        },
        {
          path: "organization/teams",
          element: <TeamListPage />,
        },
        {
          path: "organization/roles",
          element: <TabRole />,
        },
        {
          path: "project/property",
          element: <Properties />,
        },
        {
          path: "project/property/add",
          element: <AddProperty />,
          children: [
            {
              path: "details",
              element: <AddPropertyStepper />,
            },
            {
              path: "details",
              element: <AddPropertyStepper />,
            },
          ],
        },
        {
          path: "project/property/detail/:id",
          element: <PropertyDetail />,
        },

        //Sales Teams Management
        // {
        //   path: "/leadassignment",
        //   element: <SalesMainPage />,
        // },
        // {
        //   path: "/planner&task",
        //   element: <PlannerMainPage />,
        // },
      ],
    },
    {
      path: "/maintenance",
      element: <CommonLayout />,
      children: [
        {
          path: "404",
          element: <MaintenanceError />,
        },
        {
          path: "500",
          element: <MaintenanceError500 />,
        },
        {
          path: "under-construction",
          element: <MaintenanceUnderConstruction />,
        },
        {
          path: "coming-soon",
          element: <MaintenanceComingSoon />,
        },
      ],
    },
  ],
};

export default MainRoutes;

import { lazy } from "react";

// project import
import MainLayout from "../layout/MainLayout";
import CommonLayout from "../layout/CommonLayout";
import Loadable from "../components/Loadable";
import AuthGuard from "../utils/route-guard/AuthGuard";
import Userpage from "../pages/user/userpage";
import Projectpage from "../pages/project/Projectpage";
import CustomerListPage from "../pages/organization/list";
import TabRole from "../sections/role/userrole";
import Teampage from "../sections/team/Teampage";
import TeamListPage from "../pages/organization/teamlist";
import Project from "../pages/extra-pages/project";

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
  lazy(() => import("../pages/extra-pages/sample-page"))
);

const Organisation = Loadable(
  lazy(() => import("../pages/extra-pages/organisation"))
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
          element: <SamplePage />,
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
          path: "setting",
          element: <Projectpage />,
        },
        {
          path: "organization/users",
          element: <CustomerListPage />,
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

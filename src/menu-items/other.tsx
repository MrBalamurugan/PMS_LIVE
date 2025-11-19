// third-party
import { FormattedMessage } from "react-intl";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined,
} from "@ant-design/icons";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// icons
const icons = {
  ChromeOutlined,
  MenuUnfoldOutlined,
  BoxPlotOutlined,
  StopOutlined,
  BorderOutlined,
  SmileOutlined,
  GatewayOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  SettingsOutlinedIcon,
  NoteAltOutlinedIcon,
  LocationCityOutlinedIcon,
  LeaderboardIcon,
  AccountBoxOutlinedIcon,
  Groups2OutlinedIcon,
  AdminPanelSettingsOutlinedIcon,
  ManageAccountsOutlinedIcon,
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: "other",
  title: <FormattedMessage id="others" />,
  type: "group",
  children: [
    {
      id: "Dashboard",
      title: <FormattedMessage id="Dashboard" />,
      type: "item",
      url: "/dashboard",
      icon: icons.ChromeOutlined,
    },
    {
      id: "Organization",
      title: <FormattedMessage id="Organization" />,
      type: "item",
      icon: icons.LocationCityOutlinedIcon,
      url: "/organization",
    },
    {
      id: "User Management",
      title: <FormattedMessage id="User Management" />,
      type: "collapse",
      icon: icons.ManageAccountsOutlinedIcon,
      children: [
        {
          id: "Users",
          title: <FormattedMessage id="Users" />,
          type: "item",
          icon: icons.AccountBoxOutlinedIcon,
          url: "/usermanagement/users",
        },
        {
          id: "Teams",
          title: <FormattedMessage id="Teams" />,
          type: "item",
          icon: icons.Groups2OutlinedIcon,
          url: "/usermanagement/teams",
        },
        {
          id: "Roles",
          title: <FormattedMessage id="Roles" />,
          type: "item",
          icon: icons.AdminPanelSettingsOutlinedIcon,
          url: "/usermanagement/roles",
        },
      ],
    },
  ],
};

export default other;

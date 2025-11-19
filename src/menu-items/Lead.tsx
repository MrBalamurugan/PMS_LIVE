// third-party
import { FormattedMessage } from "react-intl";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import WifiProtectedSetupOutlinedIcon from "@mui/icons-material/WifiProtectedSetupOutlined";
import SegmentOutlinedIcon from "@mui/icons-material/SegmentOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
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
  AccountCircleOutlinedIcon,
  WifiProtectedSetupOutlinedIcon,
  SegmentOutlinedIcon,
  SupervisorAccountOutlinedIcon,
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const lead = {
  id: "Lead & Customer CRM",
  title: <FormattedMessage id="Lead & Customer CRM" />,
  type: "group",
  children: [
    {
      id: "	Lead Dashboard",
      title: <FormattedMessage id="	Lead Dashboard" />,
      type: "item",
      url: "/maintenance/under-construction",
      icon: icons.ChromeOutlined,
    },
    // {
    //   id: "documentation",
    //   title: <FormattedMessage id="documentation" />,
    //   type: "item",
    //   url: "https://links.codedthemes.com/BQFrl",
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true,
    //   chip: {
    //     label: "gitbook",
    //     color: "secondary",
    //     size: "small",
    //   },
    // },
    // },
    {
      id: "	Lead Capture",
      title: <FormattedMessage id="	Lead Capture" />,
      type: "item",
      icon: icons.SupervisorAccountOutlinedIcon,
      url: "/maintenance/under-construction",
    },
    {
      id: "	Lead Segmentation",
      title: <FormattedMessage id="	Lead Segmentation" />,
      type: "item",
      icon: icons.SegmentOutlinedIcon,
      url: "/maintenance/under-construction",
    },
    // {
    //   id: "User",
    //   title: <FormattedMessage id="User" />,
    //   type: "item",
    //   url: "organization/users",
    //   icon: icons.ChromeOutlined,
    // },
    // {
    //   id: "Team",
    //   title: <FormattedMessage id="Team" />,
    //   type: "item",
    //   url: "organization/teams",
    //   icon: icons.ChromeOutlined,
    // },
    // {
    //   id: "Role",
    //   title: <FormattedMessage id="Role" />,
    //   type: "item",
    //   url: "organization/roles",
    //   icon: icons.ChromeOutlined,
    // },
    {
      id: "	Follow-Ups",
      title: <FormattedMessage id="	Follow-Ups" />,
      type: "item",
      url: "/maintenance/under-construction",
      icon: icons.WifiProtectedSetupOutlinedIcon,
    },
    {
      id: "	Customer",
      title: <FormattedMessage id="	Customer" />,
      type: "item",
      icon: icons.AccountCircleOutlinedIcon,
      url: "/maintenance/under-construction",
    },
  ],
};

export default lead;

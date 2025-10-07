// third-party
import { FormattedMessage } from "react-intl";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
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
      id: "Project",
      title: <FormattedMessage id="Project" />,
      type: "item",
      icon: icons.NoteAltOutlinedIcon,
      url: "/project",
    },
    {
      id: "Organization",
      title: <FormattedMessage id="Organization" />,
      type: "item",
      icon: icons.LocationCityOutlinedIcon,
      url: "/organization",
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
      id: "Setting",
      title: <FormattedMessage id="Setting" />,
      type: "item",
      url: "/setting",
      icon: icons.SettingsOutlinedIcon,
    },
    {
      id: "Lead",
      title: <FormattedMessage id="Lead" />,
      type: "item",
      icon: icons.LeaderboardIcon,
      url: "/lead",
    },
  ],
};

export default other;

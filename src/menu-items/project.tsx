// third-party
import { FormattedMessage } from "react-intl";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  NoteAltOutlinedIcon,
  FactCheckOutlinedIcon,
};
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const project = {
  id: "group-project",
  title: <FormattedMessage id="Project Hierarchy" />,
  icon: icons.AppstoreAddOutlined,
  type: "group",
  children: [
    {
      id: "Project",
      title: <FormattedMessage id="Project" />,
      type: "item",
      icon: icons.NoteAltOutlinedIcon,
      url: "/project",
    },
    {
      id: "Properties",
      title: <FormattedMessage id="Properties" />,
      type: "item",
      icon: icons.FactCheckOutlinedIcon,
      url: "project/property",
    },
  ],
};

export default project;

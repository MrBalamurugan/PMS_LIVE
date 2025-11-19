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

const sales = {
  id: "group-project",
  title: <FormattedMessage id="Sales Team Management" />,
  icon: icons.AppstoreAddOutlined,
  type: "group",
  children: [
    {
      id: "Lead Assignments",
      title: <FormattedMessage id="Lead Assignments" />,
      type: "item",
      icon: icons.NoteAltOutlinedIcon,
      url: "/leadassignment",
    },
    {
      id: "Planner & Task",
      title: <FormattedMessage id="Planner & Task" />,
      type: "item",
      icon: icons.FactCheckOutlinedIcon,
      url: "/planner&task",
    },
  ],
};

export default sales;

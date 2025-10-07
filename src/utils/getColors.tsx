import type { Theme } from "@mui/material/styles";

type ColorType =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

const getColors = (theme: Theme, color: ColorType = "primary") => {
  switch (color) {
    case "secondary":
      return theme.palette.secondary;
    case "error":
      return theme.palette.error;
    case "warning":
      return theme.palette.warning;
    case "info":
      return theme.palette.info;
    case "success":
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
};

export default getColors;

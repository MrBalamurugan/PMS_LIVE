import type { Theme } from "@mui/material/styles";

// Extend MUI Theme to include `customShadows` if you have it in your theme
interface CustomShadows {
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  info: string;
  success: string;
  primaryButton: string;
  secondaryButton: string;
  errorButton: string;
  warningButton: string;
  infoButton: string;
  successButton: string;
}

// Your app’s Theme type (Theme + CustomShadows)
type ExtendedTheme = Theme & {
  customShadows: CustomShadows;
};

// Allowed shadow keys
type ShadowType =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primaryButton"
  | "secondaryButton"
  | "errorButton"
  | "warningButton"
  | "infoButton"
  | "successButton";

const getShadow = (theme: ExtendedTheme, shadow: ShadowType = "primary") => {
  return theme.customShadows[shadow];
};

export default getShadow;

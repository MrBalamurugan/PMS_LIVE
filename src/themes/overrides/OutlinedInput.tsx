// project import
import getShadow from "../../utils/getShadow";
import getColors from "../../utils/getColors";
import { ThemeMode } from "../../config";

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //
interface GetColorProps {
  variant: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  theme: any;
}

function getColor({ variant, theme }: GetColorProps) {
  const colors = getColors(theme, variant);
  const { light } = colors;

  const shadows = getShadow(theme, variant); // no template string needed

  return {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: light,
    },
    "&.Mui-focused": {
      boxShadow: shadows,
      "& .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${light}`,
      },
    },
  };
}

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme: any) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10.5px 14px 10.5px 12px",
        },
        notchedOutline: {
          borderColor:
            theme.palette.mode === ThemeMode.DARK
              ? theme.palette.grey[200]
              : theme.palette.grey[300],
        },
        root: {
          ...getColor({ variant: "primary", theme }),
          "&.Mui-error": {
            ...getColor({ variant: "error", theme }),
          },
        },
        inputSizeSmall: {
          padding: "7.5px 8px 7.5px 12px",
        },
        inputMultiline: {
          padding: 0,
        },
        colorSecondary: getColor({ variant: "secondary", theme }),
        colorError: getColor({ variant: "error", theme }),
        colorWarning: getColor({ variant: "warning", theme }),
        colorInfo: getColor({ variant: "info", theme }),
        colorSuccess: getColor({ variant: "success", theme }),
      },
    },
  };
}

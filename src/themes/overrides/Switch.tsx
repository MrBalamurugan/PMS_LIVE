// ==============================|| SWITCH - SIZE STYLE ||============================== //
import type { Theme } from "@mui/material";

interface SizeStyle {
  width: number;
  height: number;
  base: number;
  thumb: number;
  trackRadius: number;
}

function getSizeStyle(size: "small" | "medium" | "large"): SizeStyle {
  switch (size) {
    case "small":
      return { width: 28, height: 16, base: 12, thumb: 10, trackRadius: 8 };
    case "large":
      return { width: 60, height: 28, base: 32, thumb: 22, trackRadius: 24 };
    case "medium":
    default:
      return { width: 44, height: 22, base: 22, thumb: 16, trackRadius: 16 };
  }
}

function switchStyle(_theme: Theme, size: "small" | "medium" | "large") {
  const sizes = getSizeStyle(size);

  return {
    width: sizes.width,
    height: sizes.height,
    "& .MuiSwitch-switchBase": {
      padding: 3,
      "&.Mui-checked": {
        transform: `translateX(${sizes.base}px)`,
      },
    },
    "& .MuiSwitch-thumb": {
      width: sizes.thumb,
      height: sizes.thumb,
    },
    "& .MuiSwitch-track": {
      borderRadius: sizes.trackRadius,
    },
  };
}

// ==============================|| OVERRIDES - SWITCH ||============================== //
export default function Switch(_theme: Theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        track: {
          opacity: 1,
          backgroundColor: _theme.palette.secondary.main,
          boxSizing: "border-box",
        },
        thumb: {
          borderRadius: "50%",
          transition: _theme.transitions.create(["width"], {
            duration: 200,
          }),
        },
        switchBase: {
          "&.Mui-checked": {
            color: "#fff",
            "& + .MuiSwitch-track": {
              opacity: 1,
            },
            "&.Mui-disabled": {
              color: _theme.palette.background.paper,
            },
          },
          "&.Mui-disabled": {
            color: _theme.palette.background.paper,
            "+.MuiSwitch-track": {
              opacity: 0.3,
            },
          },
        },
        root: {
          color: _theme.palette.text.primary,
          padding: 0,
          margin: 8,
          display: "flex",
          "& ~ .MuiFormControlLabel-label": {
            margin: 6,
          },
          ...switchStyle(_theme, "medium"),
        },
        sizeLarge: { ...switchStyle(_theme, "large") },
        sizeSmall: { ...switchStyle(_theme, "small") },
      },
    },
  };
}

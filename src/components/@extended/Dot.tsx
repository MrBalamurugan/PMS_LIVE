import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import getColors from "../../utils/getColors";

// project import

const Dot = ({ color, size, variant, sx }: any) => {
  const theme = useTheme();
  const colors = getColors(theme, color || "primary");
  const { main } = colors;

  return (
    <Box
      component="span"
      sx={{
        width: size || 8,
        height: size || 8,
        borderRadius: "50%",
        bgcolor: variant === "outlined" ? "" : main,
        ...(variant === "outlined" && {
          border: `1px solid ${main}`,
        }),
        ...sx,
      }}
    />
  );
};

Dot.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  variant: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Dot;

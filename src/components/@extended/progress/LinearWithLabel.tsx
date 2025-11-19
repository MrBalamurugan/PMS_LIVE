import PropTypes from "prop-types";
import { Box, LinearProgress, Typography } from "@mui/material";

interface LinearWithLabelProps {
  value: number;
  color?: "primary" | "secondary" | "error" | "info" | "warning" | "success";
  sx?: object;
  [key: string]: any; // allows MUI’s extra props safely
}

export default function LinearWithLabel({
  value,
  ...others
}: LinearWithLabelProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  sx: PropTypes.object,
};

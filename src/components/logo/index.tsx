import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";
import ExpLogo from "../../assets/images/brikbyte.png";
import ColLogo from "../../assets/images/briksbyte.png";

// project import
// import LogoMain from "./LogoMain";
// import LogoIcon from "./LogoIcon";
import { APP_DEFAULT_PATH } from "../../config";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ reverse, isIcon, sx, to }: any) => (
  <ButtonBase
    disableRipple
    component={Link}
    to={!to ? APP_DEFAULT_PATH : to}
    sx={sx}
  >
    {isIcon ? (
      <img src={ColLogo} alt="Logo Icon" style={{ height: 40 }} />
    ) : (
      <img
        src={ExpLogo}
        alt="Main Logo"
        style={{
          height: 80,
          paddingTop: 10,
          transform: reverse ? "scaleX(-1)" : "none",
        }}
      />
    )}
  </ButtonBase>
);

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default LogoSection;

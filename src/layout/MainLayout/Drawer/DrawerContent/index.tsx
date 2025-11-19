// material-ui
import { Box, useMediaQuery, useTheme } from "@mui/material";

// project import
// import NavCard from "./NavCard";
import Navigation from "./Navigation";
import { useSelector } from "../../../../store";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const menu = useSelector((state: any) => state.menu);
  const { drawerOpen } = menu;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
      }}
    >
      <Navigation />
      {
        drawerOpen && !matchDownMD
        // && <NavCard />
      }
    </Box>
  );
};

export default DrawerContent;

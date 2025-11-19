import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";

// project import

import MiniDrawerStyled from "./MiniDrawerStyled";

import { dispatch, useSelector } from "../../../store";
import { DRAWER_WIDTH } from "../../../config";
import { openDrawer } from "../../../store/reducers/menu";
import DrawerContent from "./DrawerContent";
import DrawerHeader from "./DrawerHeader";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ window }: any) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const menu = useSelector((state: any) => state.menu);
  const { drawerOpen } = menu;

  // responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(
    () => <DrawerHeader open={drawerOpen} />,
    [drawerOpen]
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}
      aria-label="mailbox folders"
    >
      {!matchDownMD ? (
        <MiniDrawerStyled
          variant="permanent"
          open={drawerOpen}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => dispatch(openDrawer(!drawerOpen))}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: "none",
              boxShadow: "inherit",
            },
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

MainDrawer.propTypes = {
  window: PropTypes.object,
};

export default MainDrawer;

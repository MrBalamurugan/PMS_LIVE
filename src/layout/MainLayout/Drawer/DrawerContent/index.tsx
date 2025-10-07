// material-ui
import { useMediaQuery, useTheme } from "@mui/material";

// project import
// import NavCard from "./NavCard";
import SimpleBar from "../../../../components/third-party/SimpleBar";
import Navigation from "./Navigation";
import { useSelector } from "../../../../store";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const menu = useSelector((state: any) => state.menu);
  const { drawerOpen } = menu;

  return (
    <SimpleBar
      sx={{
        "& .simplebar-content": {
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Navigation />
      {
        drawerOpen && !matchDownMD
        // && <NavCard />
      }
    </SimpleBar>
  );
};

export default DrawerContent;

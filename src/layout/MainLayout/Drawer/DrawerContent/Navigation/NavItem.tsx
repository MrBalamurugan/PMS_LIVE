import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project import
// import useConfig from "../../../../../hooks/useConfig";
// import Dot from "../../../../../components/@extended/Dot";
import { ThemeMode } from "../../../../../config";
import { activeItem, openDrawer } from "../../../../../store/reducers/menu";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // const { menuOrientation } = useConfig();
  const { drawerOpen, openItem } = useSelector((state: any) => state.menu);

  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const itemTarget = item.target ? "_blank" : "_self";

  // Use Link directly for internal, <a> for external
  const listItemProps = item.external
    ? { component: "a", href: item.url, target: itemTarget }
    : { component: Link, to: item.url, target: itemTarget };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : (
    false
  );

  const isSelected = openItem.includes(item.id);

  const pathname = document.location.pathname;

  useEffect(() => {
    if (pathname.includes(item.url)) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor =
    theme.palette.mode === ThemeMode.DARK ? "grey.400" : "text.primary";
  const iconSelectedColor =
    theme.palette.mode === ThemeMode.DARK && drawerOpen
      ? "text.primary"
      : "primary.main";

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          "&:hover": {
            bgcolor:
              theme.palette.mode === ThemeMode.DARK
                ? "divider"
                : "primary.lighter",
          },
          "&.Mui-selected": {
            bgcolor:
              theme.palette.mode === ThemeMode.DARK
                ? "divider"
                : "primary.lighter",
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            "&:hover": {
              color: iconSelectedColor,
              bgcolor:
                theme.palette.mode === ThemeMode.DARK
                  ? "divider"
                  : "primary.lighter",
            },
          },
        }),
        ...(!drawerOpen && {
          "&:hover": { bgcolor: "transparent" },
          "&.Mui-selected": {
            bgcolor: "transparent",
            "&:hover": { bgcolor: "transparent" },
          },
        }),
      }}
      {...(downLG && { onClick: () => dispatch(openDrawer(false)) })}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === ThemeMode.DARK
                    ? "secondary.light"
                    : "secondary.lighter",
              },
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor:
                  theme.palette.mode === ThemeMode.DARK
                    ? "primary.900"
                    : "primary.lighter",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === ThemeMode.DARK
                      ? "primary.darker"
                      : "primary.lighter",
                },
              }),
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || level !== 1) && (
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{ color: isSelected ? iconSelectedColor : textColor }}
            >
              {item.title}
            </Typography>
          }
        />
      )}

      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;

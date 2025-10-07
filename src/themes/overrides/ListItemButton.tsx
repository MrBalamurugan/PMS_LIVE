// ==============================|| OVERRIDES - LIST ITEM ICON ||============================== //

export default function ListItemButton(theme: any) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: theme.palette.primary.main,
            "& .MuiListItemIcon-root": {
              color: theme.palette.primary.main,
            },
          },
        },
      },
    },
  };
}

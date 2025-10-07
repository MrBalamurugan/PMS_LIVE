// ==============================|| OVERRIDES - LIST ITEM ICON ||============================== //

export default function ListItemIcon(theme: any) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
          color: theme.palette.text.primary,
        },
      },
    },
  };
}

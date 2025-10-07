// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function Accordion(theme: any) {
  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.secondary.light}`,
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&:before": {
            display: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.secondary.lighter,
          },
        },
      },
    },
  };
}

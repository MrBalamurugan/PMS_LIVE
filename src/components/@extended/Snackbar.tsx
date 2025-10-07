// material-ui
import { Alert, Button, Fade, Grow, Slide } from "@mui/material";
import MuiSnackbar from "@mui/material/Snackbar";

// project-import
import IconButton from "./IconButton";

// assets
import { CloseOutlined } from "@ant-design/icons";
import { dispatch, useSelector } from "../../store";
import { closeSnackbar } from "../../store/reducers/snackbar";

// animation function
function TransitionSlideLeft(props: any) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: any) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: any) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: any) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: any) {
  return <Grow {...props} />;
}

// animation options
const animation = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade,
};

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const snackbar = useSelector((state: any) => state.snackbar);
  const {
    actionButton,
    anchorOrigin,
    alert,
    close,
    message,
    open,
    transition,
    variant,
  } = snackbar;

  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {/* default snackbar */}
      {variant === "default" && (
        <MuiSnackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition]}
          action={
            <>
              <Button
                color="secondary"
                size="small"
                onClick={(e) => handleClose(e, "buttonClick")}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
                sx={{ mt: 0.25 }}
              >
                <CloseOutlined />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {variant === "alert" && (
        <MuiSnackbar
          TransitionComponent={animation[transition]}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            action={
              <>
                {actionButton !== false && (
                  <Button
                    color={alert.color}
                    size="small"
                    onClick={(e) => handleClose(e, "buttonClick")}
                  >
                    UNDO
                  </Button>
                )}
                {close !== false && (
                  <IconButton
                    sx={{ mt: 0.25 }}
                    size="small"
                    aria-label="close"
                    variant="contained"
                    color={alert.color}
                    onClick={handleClose}
                  >
                    <CloseOutlined />
                  </IconButton>
                )}
              </>
            }
            sx={{
              ...(alert.variant === "outlined" && {
                bgcolor: "grey.0",
              }),
            }}
          >
            {message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
};

export default Snackbar;

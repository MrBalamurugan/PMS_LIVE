import PropTypes from "prop-types";

// material-ui
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";

// project import

// assets
import { DeleteFilled } from "@ant-design/icons";
import { PopupTransition } from "../../../../components/@extended/Transitions";
import Avatar from "../../../../components/@extended/Avatar";

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertOrganisationDelete({
  title,
  open,
  handleClose,
}: any) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar
            color="error"
            sx={{ width: 72, height: 72, fontSize: "1.75rem" }}
          >
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {" "}
                &quot;{title}&quot;{" "}
              </Typography>
              user, all task assigned to that user will also be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button
              fullWidth
              onClick={() => handleClose(false)}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={() => handleClose(true)}
              autoFocus
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertOrganisationDelete.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  message: PropTypes.string,
};

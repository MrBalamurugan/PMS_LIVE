import PropTypes from "prop-types";
import { useState } from "react";
import { Chip, Dialog } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; // User
import Groups2Icon from "@mui/icons-material/Groups2";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded"; // material-ui
import { useNavigate } from "react-router-dom";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import Avatar from "../../../components/@extended/Avatar";
import MainCard from "../../../components/MainCard";
import OrganisationPreview from "./OrganizationPreview";
import IconButton from "../../../components/@extended/IconButton";
import AlertOrganisationDelete from "./sections/AlertOrganizationDelete";
import AddOrganisation from "./sections/AddOrganization";

const avatarImages = import.meta.glob(
  "../../assets/images/users/*.{png,jpg,jpeg,svg}",
  {
    eager: true,
  }
);

// Turn it into a lookup object
const avatarMap: Record<string, string> = {};
for (const path in avatarImages) {
  const fileName = path.split("/").pop()!;
  avatarMap[fileName] = (avatarImages[path] as any).default;
}

// ==============================|| CUSTOMER - CARD ||============================== //

const OrganisationCard = ({ customer, onDelete, onSave }: any) => {
  // console.log("customer OrganisationCard", customer);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = (confirmDelete: boolean) => {
    setOpenAlert(false); // close dialog
    // handleMenuClose();
    if (confirmDelete && onDelete) {
      onDelete(customer.id); // delete only if confirmed
    }
  };
  // const [anchorEl, setAnchorEl] = useState(null);

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <>
      <MainCard
        sx={{
          boxShadow: "1px 4px 6px rgba(116, 116, 116, 0.15)",
          height: 1,
          "& .MuiCardContent-root": {
            height: 1,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disableGutters
                sx={{ alignItems: "flex-start", gap: 2 }} // spacing between logo & text
              >
                {/* LEFT: Logo */}
                <Avatar
                  alt={customer.companyName}
                  src={
                    customer.logo
                      ? customer.logo
                      : avatarMap[`avatar-${customer.avatar ?? 1}.png`]
                  }
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%", // to ensure round style like reference
                  }}
                />

                {/* RIGHT: Details */}
                <Stack spacing={1.5} marginLeft={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {customer.companyName}
                  </Typography>

                  <Typography variant="caption" color="secondary">
                    {customer.fatherName || "Parent Company"}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <NearMeRoundedIcon
                      style={{ fontSize: "1rem", color: "#818AAA" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {customer.country}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailRoundedIcon
                      style={{ fontSize: "1rem", color: "#818AAA" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {customer.email}
                    </Typography>
                  </Stack>
                </Stack>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider
              sx={{
                borderColor: "#818AAA",
                borderBottomWidth: 1,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              {/* Left: Branches */}
              <Grid item>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/organizationoverview`, { state: { customer } })
                  }
                >
                  <ApartmentRoundedIcon
                    fontSize="medium"
                    sx={{ color: "#818AAA" }}
                  />
                  <Typography variant="body2" fontSize="medium">
                    {customer.branchCount ?? 3} Branches
                  </Typography>
                </Stack>
              </Grid>

              {/* Right: Projects */}
              <Grid item>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FileCopyRoundedIcon
                    fontSize="medium"
                    sx={{ color: "#818AAA" }}
                    onClick={() =>
                      navigate(`/project`, { state: { customer } })
                    }
                  />
                  <Typography variant="body2" fontSize="medium">
                    {customer.projectCount ?? 2} Projects
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} marginTop={1}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <Chip
                  icon={<PersonIcon />}
                  label={
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ position: "relative", top: "3px" }}
                    >
                      <Typography variant="body2">Users</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          position: "relative",
                          top: "-5px",
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                      >
                        {customer.userCount ?? 1}
                      </Typography>
                    </Stack>
                  }
                  sx={{
                    "& .MuiChip-icon": {
                      color: "#818AAA", // force icon color
                    },
                  }}
                  onClick={() =>
                    navigate(`/organization/users`, { state: { customer } })
                  }
                  clickable
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Chip
                  icon={<Groups2Icon sx={{ color: "#818AAA" }} />}
                  label={
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ position: "relative", top: "3px" }}
                    >
                      <Typography variant="body2">Teams</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          position: "relative",
                          top: "-5px",
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                      >
                        {customer.teamCount ?? 5}
                      </Typography>
                    </Stack>
                  }
                  onClick={() =>
                    navigate(`/organization/teams`, { state: { customer } })
                  }
                  clickable
                  variant="outlined"
                  sx={{
                    "& .MuiChip-icon": {
                      color: "#818AAA", // force icon color
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Chip
                  icon={<AssignmentRoundedIcon sx={{ color: "#818AAA" }} />}
                  label={
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ position: "relative", top: "3px" }}
                    >
                      <Typography variant="body2">Roles</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          position: "relative",
                          top: "-5px",
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                      >
                        {customer.roleCount ?? 2}
                      </Typography>
                    </Stack>
                  }
                  onClick={() =>
                    navigate(`/organization/roles`, { state: { customer } })
                  }
                  clickable
                  variant="outlined"
                  sx={{
                    "& .MuiChip-icon": {
                      color: "#818AAA", // force icon color
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 1, mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="secondary">
            Updated in {customer.time}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => setAdd(true)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => setOpenAlert(true)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Dialog
        open={add}
        onClose={handleAdd}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "100%",
            maxWidth: "900px",
          },
        }}
      >
        <AddOrganisation
          customer={customer}
          onCancel={handleAdd}
          onSave={onSave}
        />
      </Dialog>

      <OrganisationPreview
        customer={customer}
        open={open}
        onClose={handleClose}
      />
      <AlertOrganisationDelete
        title={customer.companyName}
        open={openAlert}
        handleClose={handleAlertClose}
      />
    </>
  );
};

OrganisationCard.propTypes = {
  customer: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

export default OrganisationCard;

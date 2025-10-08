import PropTypes from "prop-types";
import { useState } from "react";
import { Drawer, Tooltip } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import { Badge } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; // User
import Groups2Icon from "@mui/icons-material/Groups2";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded"; // material-ui
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { useNavigate } from "react-router-dom";
import {
  // Box,
  Button,
  // Chip,
  // Dialog,
  Divider,
  Fade,
  Grid,
  // Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

// third-party
// import { PatternFormat } from "react-number-format";
// import { PDFDownloadLink } from "@react-pdf/renderer";

// project import

// assets
import {
  EnvironmentOutlined,
  // LinkOutlined,
  MailOutlined,
  MoreOutlined,
  // PhoneOutlined,
} from "@ant-design/icons";
import Avatar from "../../components/@extended/Avatar";
import MainCard from "../../components/MainCard";
import OrganisationPreview from "./OrganizationPreview";
import IconButton from "../../components/@extended/IconButton";
import AlertOrganisationDelete from "./AlertOrganizationDelete";
import AddOrganisation from "./AddOrganization";
// import ListSmallCard from "./export-pdf/ListSmallCard";

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

// Example usage
// const avatarImage = avatarMap["avatar-1.png"];
// constant
// ==============================|| CUSTOMER - CARD ||============================== //

const OrganisationCard = ({ customer, onDelete }: any) => {
  console.log("customer OrganisationCard", customer);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = (confirmDelete: boolean) => {
    setOpenAlert(false); // close dialog
    handleMenuClose();
    if (confirmDelete && onDelete) {
      onDelete(customer.id); // delete only if confirmed
    }
  };
  const handleAlertOpen = () => {
    setOpenAlert(true);
  };
  // const handleAlertClose = () => {
  //   if (onDelete) onDelete(customer.id);
  //   setOpenAlert(false);
  //   handleMenuClose();
  // };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <>
      <MainCard
        sx={{
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
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    color="secondary"
                    onClick={handleMenuClick}
                  >
                    <MoreOutlined style={{ fontSize: "1.15rem" }} />
                  </IconButton>
                }
              >
                <ListItemAvatar sx={{ mr: 2 }}>
                  {customer.logo ? (
                    <Avatar
                      alt={customer.companyName}
                      src={customer.logo} // use base64 logo
                      sx={{ width: 56, height: 56 }} // optional size
                    />
                  ) : (
                    <Avatar
                      alt={customer.companyName}
                      src={avatarMap[`avatar-${customer.avatar ?? 1}.png`]}
                      sx={{ width: 56, height: 56 }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {customer.companyName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {customer.fatherName}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {/* <MenuItem
                sx={{ a: { textDecoration: "none", color: "inherit" } }}
              >
                <>
                  {" "}
                  <PDFDownloadLink
                    document={<ListSmallCard customer={customer} />}
                    fileName={`Customer-${customer.companyName}.pdf`}
                  >
                    Export PDF
                  </PDFDownloadLink>
                </>
              </MenuItem> */}
              <MenuItem onClick={handleAdd}>Edit</MenuItem>
              <MenuItem onClick={handleAlertOpen}>Delete</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>{customer.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <List
                  sx={{
                    p: 0,
                    overflow: "hidden",
                    "& .MuiListItem-root": { px: 0, py: 0.5 },
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <MailOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          {customer.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {/* <ListItem>
                    <ListItemIcon>
                      <PhoneOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          <PatternFormat
                            displayType="text"
                            format="+1 (###) ###-####"
                            mask="_"
                            defaultValue={customer.contact}
                          />
                        </Typography>
                      }
                    />
                  </ListItem> */}
                </List>
              </Grid>
              <Grid item xs={6}>
                <List
                  sx={{
                    p: 0,
                    overflow: "hidden",
                    "& .MuiListItem-root": { px: 0, py: 0.5 },
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <EnvironmentOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          {customer.country}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {/* <ListItem>
                    <ListItemIcon>
                      <LinkOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href="https://google.com"
                          target="_blank"
                          sx={{ textTransform: "lowercase" }}
                        >
                          https://{customer.companyName}.en
                        </Link>
                      }
                    />
                  </ListItem> */}
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} alignItems="center">
              {/* User with badge */}
              <Badge
                badgeContent={customer.userCount ?? 1}
                color="secondary"
                overlap="circular"
              >
                <Tooltip title="Users">
                  <IconButton
                    onClick={() =>
                      navigate(`/organization/users`, { state: { customer } })
                    }
                  >
                    <PersonIcon fontSize="large" sx={{ color: "grey.500" }} />
                  </IconButton>
                </Tooltip>
              </Badge>

              {/* Team with badge */}
              <Badge
                badgeContent={customer.teamCount ?? 5}
                color="primary"
                overlap="circular"
              >
                <Tooltip title="Teams">
                  <IconButton
                    onClick={() =>
                      navigate(`/organization/teams`, { state: { customer } })
                    }
                  >
                    <Groups2Icon fontSize="large" sx={{ color: "grey.500" }} />
                  </IconButton>
                </Tooltip>
              </Badge>

              {/* Role with badge */}
              <Badge
                badgeContent={customer.roleCount ?? 2}
                color="error"
                overlap="circular"
              >
                <Tooltip title="Roles">
                  <IconButton
                    onClick={() =>
                      navigate(`/organization/roles`, { state: { customer } })
                    }
                  >
                    <AssignmentRoundedIcon
                      fontSize="large"
                      sx={{ color: "grey.500" }}
                    />
                  </IconButton>
                </Tooltip>
              </Badge>

              {/* Project with badge */}
              <Badge
                badgeContent={customer.roleCount ?? 2}
                color="warning"
                overlap="circular"
              >
                <Tooltip title="Projects">
                  <IconButton
                    onClick={() =>
                      navigate(`/project`, { state: { customer } })
                    }
                  >
                    <NoteAddOutlinedIcon
                      fontSize="large"
                      sx={{ color: "grey.500" }}
                    />
                  </IconButton>
                </Tooltip>
              </Badge>
            </Stack>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: "auto", mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="secondary">
            Updated in {customer.time}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleClickOpen}>
            Preview
          </Button>
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Drawer
        anchor="right"
        open={add}
        onClose={handleAdd}
        PaperProps={{
          sx: { width: { xs: "100%", sm: "60%" }, p: 2 },
        }}
      >
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Edit Organization</Typography>
          <IconButton onClick={handleAdd}>
            <CloseIcon />
          </IconButton>
        </Stack> */}
        <AddOrganisation customer={customer} onCancel={handleAdd} />
      </Drawer>
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
  customer: PropTypes.object,
  onDelete: PropTypes.func, // ← add this
};

export default OrganisationCard;

import PropTypes from "prop-types";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons"; // add this import
// material-ui
import {
  useMediaQuery,
  Box,
  // Button,
  // Chip,
  Dialog,
  // DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  // Tooltip,
} from "@mui/material";

// third-party
import { PatternFormat } from "react-number-format";
// import { PDFDownloadLink } from "@react-pdf/renderer";

// project import

// assets
// import {
//   DeleteOutlined,
//   DownloadOutlined,
//   EditOutlined,
// } from "@ant-design/icons";
// import ListCard from "./export-pdf/ListCard";
import AddOrganisation from "./AddOrganization";
import MainCard from "../../components/MainCard";
import Avatar from "../../components/@extended/Avatar";
import { PopupTransition } from "../../components/@extended/Transitions";
import IconButton from "../../components/@extended/IconButton";
import AlertOrganisationDelete from "./AlertOrganizationDelete";
import SimpleBarScroll from "../../components/third-party/SimpleBar";

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

// ==============================|| CUSTOMER - CARD PREVIEW ||============================== //

export default function OrganisationPreview({ customer, open, onClose }: any) {
  const matchDownMD = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md")
  );
  const [openAlert, setOpenAlert] = useState(false);

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            width: 1024,
            maxWidth: 1,
            m: { xs: 1.75, sm: 2.5, md: 4 },
          },
        }}
      >
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
          <DialogTitle sx={{ px: 0 }}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0}
                  >
                    {/* <Tooltip title="Export">
                      <PDFDownloadLink
                        document={<ListCard customer={customer} />}
                        fileName={`Customer-${customer.com}.pdf`}
                      >
                        <IconButton color="secondary">
                          <DownloadOutlined />
                        </IconButton>
                      </PDFDownloadLink>
                    </Tooltip> */}
                    {/* <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={handleAdd}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip> */}
                    {/* <Tooltip title="Delete" onClick={handleClose}>
                      <IconButton color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip> */}
                  </Stack>
                }
              >
                <ListItemAvatar sx={{ mr: 0.75 }}>
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
                    <Typography variant="h5">{customer.companyName}</Typography>
                  }
                  secondary={
                    <Typography color="secondary">
                      {customer.fatherName}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme: any) => theme.palette.grey[500],
              }}
            >
              <CloseOutlined />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ px: 0 }}>
            <SimpleBarScroll sx={{ maxHeight: "70vh" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8} xl={9}>
                  <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                      <MainCard title="About Organization">
                        <Typography>
                          {customer.fatherName}, {customer.role} in
                          international company, {customer.about}
                        </Typography>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <MainCard title="Address">
                        <List sx={{ py: 0 }}>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Address1
                                  </Typography>
                                  <Typography>{customer.address1}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Currency
                                  </Typography>
                                  <Typography>{customer.currency}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Address2
                                  </Typography>
                                  <Typography>{customer.address2}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    TimeZone
                                  </Typography>
                                  <Typography>{customer.timeZone}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    City
                                  </Typography>
                                  <Typography>{customer.city}</Typography>
                                </Stack>
                              </Grid>
                              {/* <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    FiscalYearStarting
                                  </Typography>
                                  <Typography>
                                    {customer.fiscalYearStarting}
                                  </Typography>
                                </Stack>
                              </Grid> */}
                            </Grid>
                          </ListItem>
                        </List>
                      </MainCard>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <MainCard title="Emplyment">
                        <List sx={{ py: 0 }}>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Senior UI/UX designer (Year)
                                  </Typography>
                                  <Typography>2019-Current</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Job Responsibility
                                  </Typography>
                                  <Typography>
                                    Perform task related to project manager with
                                    the 100+ team under my observation. Team
                                    management is key role in this company.
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Trainee cum Project Manager (Year)
                                  </Typography>
                                  <Typography>2017-2019</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">
                                    Job Responsibility
                                  </Typography>
                                  <Typography>
                                    Team management is key role in this company.
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                        </List>
                      </MainCard>
                    </Grid> */}
                    {/* <Grid item xs={12}>
                      <MainCard title="Skills">
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            listStyle: "none",
                            p: 0.5,
                            m: 0,
                          }}
                          component="ul"
                        >
                          {customer.skills.map((skill: any, index: any) => (
                            <ListItem
                              disablePadding
                              key={index}
                              sx={{ width: "auto", pr: 0.75, pb: 0.75 }}
                            >
                              <Chip
                                color="secondary"
                                variant="outlined"
                                size="small"
                                label={skill}
                              />
                            </ListItem>
                          ))}
                        </Box>
                      </MainCard>
                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} xl={3}>
                  <MainCard>
                    <Stack spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Org Name</Typography>
                        <Typography>{customer.companyName}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{customer.email}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Contact</Typography>
                        <Typography>
                          <PatternFormat
                            displayType="text"
                            format="+1 (###) ###-####"
                            mask="_"
                            defaultValue={customer.contact}
                          />
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Location</Typography>
                        <Typography> {customer.country} </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Website</Typography>
                        <Link
                          href="https://google.com"
                          target="_blank"
                          sx={{ textTransform: "lowercase" }}
                        >
                          https://{customer.companyName}.en
                        </Link>
                      </Stack>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </SimpleBarScroll>
          </DialogContent>

          {/* <DialogActions>
            <Button color="error" onClick={onClose}>
              Close
            </Button>
          </DialogActions> */}
        </Box>
      </Dialog>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ "& .MuiDialog-paper": { p: 0 } }}
      >
        <AddOrganisation customer={customer} onCancel={handleAdd} />
      </Dialog>

      <AlertOrganisationDelete
        title={customer.fatherName}
        open={openAlert}
        handleClose={handleClose}
      />
    </>
  );
}

OrganisationPreview.propTypes = {
  customer: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

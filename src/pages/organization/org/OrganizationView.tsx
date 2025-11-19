import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  useMediaQuery,
  Grid,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

// third-party
import { PatternFormat } from "react-number-format";

// project import

// assets
import {
  EnvironmentOutlined,
  LinkOutlined,
  MailOutlined,
  // PhoneOutlined,
} from "@ant-design/icons";
import MainCard from "../../../components/MainCard";
import Avatar from "../../../components/@extended/Avatar";
import Transitions from "../../../components/@extended/Transitions";

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

// ==============================|| CUSTOMER - VIEW ||============================== //

const OrganizationView = ({ data }: any) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  // console.log("dataUser", data);
  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: `transparent !important` },
        overflow: "hidden",
      }}
    >
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: "hidden" }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid
            container
            spacing={2.5}
            sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}
          >
            <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
              <MainCard>
                <Chip
                  label={data.status}
                  size="small"
                  color="primary"
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    fontSize: "0.675rem",
                  }}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center">
                      <Avatar
                        src={
                          data.avatar?.startsWith("data:")
                            ? data.avatar
                            : `data:image/png;base64,${data.avatar}`
                        }
                      />
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">{data.name}</Typography>
                        <Typography color="secondary">{data.role}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      {/* <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">{data.age || 32}</Typography>
                        <Typography color="secondary">Age</Typography>
                      </Stack> */}
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">
                          {data.progress || 78}%
                        </Typography>
                        <Typography color="secondary">Progress</Typography>
                      </Stack>
                      <Divider orientation="vertical" flexItem />
                      {/* <Stack spacing={0.5} alignItems="center">
                        <Typography variant="h5">
                          {data.visits || "Yes"}
                        </Typography>
                        <Typography color="secondary">Visits</Typography>
                      </Stack> */}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <List
                      component="nav"
                      aria-label="main mailbox folders"
                      sx={{ py: 0 }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <MailOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{data.email}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* <ListItem>
                        <ListItemIcon>
                          <PhoneOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">
                            <PatternFormat
                              displayType="text"
                              format="+1 (###) ###-####"
                              mask="_"
                              defaultValue={data.contactNo}
                            />
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem> */}
                      <ListItem>
                        <ListItemIcon>
                          <EnvironmentOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">
                            {data.country || "India"}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LinkOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link
                            align="right"
                            href="https://google.com"
                            target="_blank"
                          >
                            https://anshan.dh.url
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="Personal Details">
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        {/* Full Name */}
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Full Name</Typography>
                            <Typography>{data.name}</Typography>
                          </Stack>
                        </Grid>

                        {/* Manager */}
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Manager</Typography>
                            <Typography>{data.manager}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Country</Typography>
                            <Typography>{data.country || "India"}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Zip Code</Typography>
                            <Typography>
                              <PatternFormat
                                displayType="text"
                                format="### ###"
                                mask="_"
                                defaultValue={data.contact || 676271}
                              />
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Address</Typography>
                        <Typography>{data.address || "-Not Yet-"}</Typography>
                      </Stack>
                    </ListItem>
                  </List>
                </MainCard>
                {/* <MainCard title="About me">
                  <Typography color="secondary">
                    Hello, I’m {data.fatherName} {data.role} based in
                    international company, {data.about}
                  </Typography>
                </MainCard> */}
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

OrganizationView.propTypes = {
  data: PropTypes.object,
};

export default OrganizationView;

import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../../components/Loader";
import { Divider } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

// material-ui
import {
  Grid,
  Stack,
  // useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  // Dialog,
  Slide,
  // Pagination,
  Typography,
} from "@mui/material";

// project import

// assets
import { PlusOutlined } from "@ant-design/icons";
import usePagination from "../../../hooks/usePagination";
import { GlobalFilter } from "../../../utils/react-table";
// import makeData from "../../data/react-table";
import AddOrganisation from "./sections/AddOrganization";
import OrganisationCard from "./OrganizationCard";
import EmptyUserCard from "../../../components/cards/skeleton/EmptyUserCard";
// import { PopupTransition } from "../../components/@extended/Transitions";
import axios from "axios";
import IconButton from "../../../components/@extended/IconButton";
import OrganizationTableView from "./OrganizationTableView";
import OrganizationTreeView from "./OrganizationTreeView";

// ==============================|| CUSTOMER - CARD ||============================== //
const allColumns = [
  { id: 1, header: "Default" },
  { id: 2, header: "Company Name" },
  { id: 3, header: "Business Type" },
  { id: 4, header: "Country" },
];

const Organisation = () => {
  const [allOrganizations, setAllOrganizations] = useState<any[]>([]);
  const [userCard, setUserCard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [sortBy, setSortBy] = useState("Default");
  const [globalFilter, setGlobalFilter] = useState("");
  const [add, setAdd] = useState(false);
  const [customer, setCustomer] = useState(null);
  // const [setPage] = useState(1);
  const handleChange = (event: any) => {
    setSortBy(event.target.value);
  };
  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const PER_PAGE = 6;

  // const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const API_URL = "https://pms-db-mock.onrender.com/Organizations";

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);
      const customers = res.data.map((org: any) => ({
        id: org.id,
        companyName: org.companyName,
        fatherName: org.businessType || "N/A",
        about: org.about || "",
        email:
          org.email ||
          `${org.companyName?.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
        contact: org.contact || "+(00) 000-0000",
        country: org.address?.country || "Unknown",
        logo: org.logo || null,
        GST: org.GST || "",
        PAN: org.PAN || "",
        timeZone: org.timeZone,
        timeFormat: org.timeFormat,
        dateFormat: org.dateFormat,
        currency: org.currency,
        time: org.time || new Date().toISOString().slice(0, 10),
        telephone: org?.telephone || "",

        address: org.address?.registeredAddress || "",
        state: org.address?.state || "",
      }));

      setAllOrganizations(customers);
      setUserCard(customers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // search
  useEffect(() => {
    const newData = allOrganizations.filter((org: any) => {
      if (!globalFilter) return true;
      const filter = globalFilter.toLowerCase();
      return (
        org.companyName?.toLowerCase().includes(filter) ||
        org.fatherName?.toLowerCase().includes(filter) ||
        org.country?.toLowerCase().includes(filter) ||
        org.email?.toLowerCase().includes(filter)
      );
    });
    setUserCard(newData);
  }, [globalFilter, allOrganizations]);

  useEffect(() => {
    fetchOrganizations();
  }, []);
  // console.log();
  // const matchDownSM = useMediaQuery((theme: any) =>
  //   theme.breakpoints.down("sm")
  // );
  const handleAddOrUpdate = () => {
    fetchOrganizations(); // re-fetch updated list
    setAdd(false); // close the drawer
  };
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      await axios.delete(`${API_URL}/${id}`);
      // Re-fetch the updated list after deletion
      fetchOrganizations();
    } catch (error) {
      console.error("Failed to delete organization", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleChangePage = (p: any) => {
  //   setPage(p);
  //   _DATA.jump(p);
  // };

  return (
    <>
      {loading && <Loader />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* Left side — Title */}
        <Stack spacing={0.5}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Organizations
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage your company structure and branches
          </Typography>
        </Stack>

        {/* Right side — Add button */}
        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Organization
        </Button>
      </Stack>

      <Box sx={{ position: "relative", mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {/* Left: Search */}
          <GlobalFilter
            preGlobalFilteredRows={userCard}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          {/* Right: Sort + Add + Icons */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            justifyContent="flex-end"
          >
            {/* Sort Dropdown */}
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                renderValue={(selected) =>
                  !selected ? (
                    <Typography variant="subtitle1">Sort By</Typography>
                  ) : (
                    <Typography variant="subtitle2">
                      Sort by ({sortBy})
                    </Typography>
                  )
                }
              >
                {allColumns.map((column) => (
                  <MenuItem key={column.id} value={column.header}>
                    {column.header}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Divider */}
            <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />

            {/* View Icons */}
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setViewMode("card")}
                sx={{
                  bgcolor:
                    viewMode === "card"
                      ? "rgba(33, 150, 243, 0.15)"
                      : "transparent", // light blue background
                  color:
                    viewMode === "card" ? "primary.main" : "text.secondary",
                  "&:hover": {
                    bgcolor: "rgba(33, 150, 243, 0.25)", // slightly darker on hover
                  },
                }}
              >
                <ViewModuleIcon />
              </IconButton>

              <IconButton
                onClick={() => setViewMode("grid")}
                sx={{
                  bgcolor:
                    viewMode === "grid"
                      ? "rgba(33, 150, 243, 0.15)"
                      : "transparent",
                  color:
                    viewMode === "grid" ? "primary.main" : "text.secondary",
                  "&:hover": {
                    bgcolor: "rgba(33, 150, 243, 0.25)",
                  },
                }}
              >
                <GridViewIcon />
              </IconButton>

              <IconButton
                onClick={() => setViewMode("tree")}
                sx={{
                  bgcolor:
                    viewMode === "tree"
                      ? "rgba(33, 150, 243, 0.15)"
                      : "transparent",
                  color:
                    viewMode === "tree" ? "primary.main" : "text.secondary",
                  "&:hover": {
                    bgcolor: "rgba(33, 150, 243, 0.25)",
                  },
                }}
              >
                <AccountTreeIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {viewMode === "card" ? (
        // Card View with scrollable container
        <Box
          sx={{
            maxHeight: "55vh",
            overflowY: "auto",
            pr: 1, // small padding to prevent scrollbar overlap
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#a8a8a8ff",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#9e9e9e",
            },
          }}
        >
          <Grid container spacing={3}>
            {userCard.length > 0 ? (
              _DATA
                .currentData()
                .sort((a: any, b: any) => {
                  if (sortBy === "Company Name")
                    return a.companyName.localeCompare(b.companyName);
                  if (sortBy === "Business Type")
                    return a.fatherName.localeCompare(b.fatherName);
                  if (sortBy === "Country")
                    return a.country.localeCompare(b.country);
                  return a;
                })
                .map((org: any, index: number) => (
                  <Slide
                    key={org.id || index}
                    direction="up"
                    in={true}
                    timeout={50}
                  >
                    <Grid item xs={12} sm={6} lg={4}>
                      <OrganisationCard
                        customer={org}
                        onDelete={handleDelete}
                        onSave={handleAddOrUpdate}
                      />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyUserCard title="You have not created any organization yet." />
            )}
          </Grid>
        </Box>
      ) : viewMode === "grid" ? (
        <OrganizationTableView data={userCard} onDelete={handleDelete} />
      ) : (
        <OrganizationTreeView data={userCard} />
      )}

      {/* <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="outlined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack> */}
      <Dialog open={add} onClose={handleAdd} fullWidth maxWidth="md">
        <AddOrganisation
          customer={customer}
          onCancel={handleAdd}
          onSave={handleAddOrUpdate}
        />
      </Dialog>
    </>
  );
};

export default Organisation;

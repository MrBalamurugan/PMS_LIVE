import { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../components/Loader";

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  // Dialog,
  Slide,
  Pagination,
  Typography,
} from "@mui/material";

// project import

// assets
import { PlusOutlined } from "@ant-design/icons";
import usePagination from "../../hooks/usePagination";
import { GlobalFilter } from "../../utils/react-table";
// import makeData from "../../data/react-table";
import AddOrganisation from "../../sections/organisation/AddOrganization";
import OrganisationCard from "../../sections/organisation/OrganizationCard";
import EmptyUserCard from "../../components/cards/skeleton/EmptyUserCard";
// import { PopupTransition } from "../../components/@extended/Transitions";
import axios from "axios";

// ==============================|| CUSTOMER - CARD ||============================== //

const allColumns = [
  {
    id: 1,
    header: "Default",
  },
  {
    id: 2,
    header: "Customer Name",
  },
  {
    id: 3,
    header: "Email",
  },
  {
    id: 4,
    header: "Contact",
  },
  {
    id: 5,
    header: "Age",
  },
  {
    id: 6,
    header: "Country",
  },
  {
    id: 7,
    header: "Status",
  },
];

const Organisation = () => {
  const [allOrganizations, setAllOrganizations] = useState<any[]>([]);
  const [userCard, setUserCard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("Default");
  const [globalFilter, setGlobalFilter] = useState("");
  const [add, setAdd] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [page, setPage] = useState(1);
  const handleChange = (event: any) => {
    setSortBy(event.target.value);
  };
  console.log("userCard", userCard);
  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const PER_PAGE = 6;

  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const API_URL = "https://pms-db-mock.onrender.com/Organizations"; // your json-server URL

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);
      const customers = res.data.map((org: any) => ({
        id: org.id,
        companyName: org.companyName,
        fatherName: org.businessType || "Real Estate",
        role: org.role || "Organization",
        about:
          org.about ||
          "A real estate organization manages buying, selling, leasing, and developing properties such as land, residential, and commercial buildings",
        email: org.email || `${org.companyName.toLowerCase()}@gmail.com`,
        contactCode: org.contactCode?.contact || "+(44) 487-3772-23",
        country: org.address?.country || "Unknown",
        skills: org.skills || [],
        avatar: org.avatar || 1,
        logo: org.logo,
        time: org.time || new Date().toISOString().slice(0, 10),

        address1: org.address?.address1 || "",
        address2: org.address?.address2 || "",
        city: org.address?.city || "",
        state: org.address?.state || "",
        zip: org.address?.zip || "",

        timeFormat: org.timeFormat,
        timeZone: org.timeZone,
        dateFormat: org.dateFormat,
        currency: org.currency,
        description: org.description,
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
    const newData = allOrganizations.filter((value: any) => {
      if (globalFilter) {
        return value.fatherName
          .toLowerCase()
          .includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setUserCard(newData);
  }, [globalFilter, allOrganizations]);
  useEffect(() => {
    fetchOrganizations();
  }, []);
  console.log();
  const matchDownSM = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
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

  const handleChangePage = (p: any) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      {loading && <Loader />}
      <Box sx={{ position: "relative", marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? "column" : "row"}
            sx={{ width: "100%" }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <GlobalFilter
              preGlobalFilteredRows={userCard}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <Stack
              direction={matchDownSM ? "column" : "row"}
              alignItems="center"
              spacing={1}
            >
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography variant="subtitle1">Sort By</Typography>
                      );
                    }

                    return (
                      <Typography variant="subtitle2">
                        Sort by ({sortBy})
                      </Typography>
                    );
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Organization
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {userCard.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a: any, b: any) {
              if (sortBy === "Customer Name")
                return a.fatherName.localeCompare(b.fatherName);
              if (sortBy === "Email") return a.email.localeCompare(b.email);
              if (sortBy === "Contact")
                return a.contact.localeCompare(b.contact);
              if (sortBy === "Age") return b.age < a.age ? 1 : -1;
              if (sortBy === "Country")
                return a.country.localeCompare(b.country);
              if (sortBy === "Status") return a.status.localeCompare(b.status);
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
                  <OrganisationCard customer={org} onDelete={handleDelete} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyUserCard title={"You have not created any organization yet."} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
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
      </Stack>

      {/* add customer dialog */}
      <Drawer
        anchor="right"
        open={add}
        onClose={handleAdd}
        PaperProps={{
          sx: { width: { xs: "100%", sm: "60%" } },
        }}
      >
        <AddOrganisation
          customer={customer}
          onCancel={handleAdd}
          onSave={handleAddOrUpdate}
        />
      </Drawer>
    </>
  );
};

export default Organisation;

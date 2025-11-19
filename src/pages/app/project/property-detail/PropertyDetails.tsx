/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Divider, Grid, Stack, Tab, Tabs } from "@mui/material";
import MainCard from "../../../../components/MainCard";
import PropertyDetailsBlock1 from "./property-details-block/PropertyDetailsBlock1";
import PropertyDetailBlock2 from "./property-details-block/PropertyDetailsBlock2";
import { propertyDetails } from "./property-details-block/PropertyDetailsConstant";
import { useState } from "react";
import { type ReactNode } from "react";
import PropertyDetailsTab1 from "./property-details-tabs/PropertyDetailsTab1";
import PropertyDetailsTab2 from "./property-details-tabs/PropertyDetailsTab2";
import PropertyDetailsTab3 from "./property-details-tabs/PropertyDetailsTab3";
import PropertyDetailsTab4 from "./property-details-tabs/PropertyDetailsTab4";
import PropertyDetailsTab5 from "./property-details-tabs/PropertyDetailsTab5";

function a11yProps(index: number) {
  return {
    id: `product-details-tab-${index}`,
    "aria-controls": `product-details-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
  [key: string]: any;
}
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-details-tabpanel-${index}`}
      aria-labelledby={`product-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
const PropertyDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (_event: any, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <PropertyDetailsBlock1 />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PropertyDetailBlock2 propertyDetails={propertyDetails} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={7} xl={8}>
          <MainCard>
            <Stack spacing={3}>
              <Stack>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  onChange={handleChange}
                  aria-label="product description tabs example"
                  variant="scrollable"
                >
                  <Tab label="Features" {...a11yProps(0)} />
                  <Tab label="Amenities" {...a11yProps(1)} />
                  <Tab label="Area" {...a11yProps(2)} />
                  {/* <Tab label="Pricing" {...a11yProps(3)} /> */}
                </Tabs>
                <Divider />
              </Stack>
              <TabPanel value={tabIndex} index={0}>
                <PropertyDetailsTab1 propertyDetails={propertyDetails} />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <PropertyDetailsTab2 propertyDetails={propertyDetails} />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <PropertyDetailsTab3 propertyDetails={propertyDetails} />
              </TabPanel>
              <TabPanel value={tabIndex} index={3}>
                <PropertyDetailsTab5 propertyDetails={propertyDetails} />
              </TabPanel>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={5} xl={4} sx={{ position: "relative" }}>
          <MainCard
            title="Documents"
            sx={{
              height: "calc(100% - 16px)",
              position: { xs: "relative", md: "absolute" },
              top: "16px",
              left: { xs: 0, md: 16 },
              right: 0,
            }}
            content={false}
          >
            <PropertyDetailsTab4 documents={propertyDetails.documents} />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};
export default PropertyDetails;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface Organization {
  id: string;
  companyName: string;
  contactcode: string;
  description: string;
  businessType: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  timeZone: string;
  logo: string;
  address: Address;
}

interface OrganizationState {
  list: Organization[];
  selectedOrganization: Organization | null;
  loading: boolean;
}

const initialState: OrganizationState = {
  list: [],
  selectedOrganization: null,
  loading: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizations(state, action: PayloadAction<Organization[]>) {
      state.list = action.payload;
    },
    setSelectedOrganization(state, action: PayloadAction<Organization | null>) {
      state.selectedOrganization = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setOrganizations, setSelectedOrganization, setLoading } =
  organizationSlice.actions;
export default organizationSlice.reducer;

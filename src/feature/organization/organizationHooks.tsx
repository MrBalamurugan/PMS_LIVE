import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "./organizationAPI";

// Organization type (optional but recommended)
interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface Organization {
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

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });
};

export const useOrganization = (id: string) => {
  return useQuery<Organization, Error>({
    queryKey: ["organization", id],
    queryFn: () => fetchOrganizationById(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) =>
      updateOrganization(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

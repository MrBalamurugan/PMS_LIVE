import axios from "axios";

const BASE_URL = "https://pms-db-mock.onrender.com/Organizations";

export const fetchOrganizations = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const fetchOrganizationById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createOrganization = async (data: any) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateOrganization = async (id: string, data: any) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteOrganization = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

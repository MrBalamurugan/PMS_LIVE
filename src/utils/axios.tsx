import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (process.env.REACT_APP_API_URL as string) ||
  "/api";

const axiosServices = axios.create({
  baseURL,
});

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.href.includes("/login")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || "Wrong Services");
  }
);

export default axiosServices;

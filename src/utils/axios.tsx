import axios from "axios";

const axiosServices = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api"
      : "https://idp-staging.faciliteasy.com", // your backend URL
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      !window.location.href.includes("/login")
    ) {
      (window.location as any) = "/login";
    }
    return Promise.reject(
      (error.response && error.response.data) || "Wrong Services"
    );
  }
);

export default axiosServices;

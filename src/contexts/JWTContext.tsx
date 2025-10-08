import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";
import qs from "qs";

// third-party
import { Chance } from "chance";
import { jwtDecode } from "jwt-decode";

// reducer - state management
import authReducer from "../store/reducers/auth";

// project import
import axiosServices from "../utils/axios";
import Loader from "../components/Loader";
import { LOGIN, LOGOUT } from "../store/reducers/actions";

const chance = new Chance();

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface JWTContextType {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  resetPassword: () => void;
  updateProfile: () => void;
}
// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};
interface JWTPayload {
  exp?: number;
  [key: string]: any;
}

const verifyToken = (serviceToken: string) => {
  if (!serviceToken) return false;

  const decoded = jwtDecode<JWTPayload>(serviceToken);

  // Ensure exp exists before comparing
  if (!decoded.exp) return false;

  return decoded.exp > Date.now() / 1000;
};

const setSession = (
  accessToken: string | null | undefined,
  refreshToken?: string
) => {
  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    axiosServices.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axiosServices.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken && verifyToken(accessToken)) {
          setSession(
            accessToken,
            localStorage.getItem("refresh_token") || undefined
          );

          const decoded = jwtDecode<any>(accessToken);
          const user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.user_name || decoded.email,
          };

          dispatch({
            type: LOGIN,
            payload: { user },
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT,
        });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Allow only this specific user
      if (email !== "brikbyte123@gmail.com" || password !== "12345678") {
        throw new Error(
          "Invalid credentials. Only the authorized user can log in."
        );
      }
      const response = await axiosServices.post(
        "/connect/token",
        qs.stringify({
          username: "brikbyte123@gmail.com",
          password: "12345678",
          provider: "external_token",
          client_id: "brikbyte_site",
          client_secret: "secret",
          grant_type: "password",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("response.data", response.data);
      const { access_token, refresh_token } = response.data;

      // ✅ Save both tokens in localStorage
      setSession(access_token, refresh_token);

      // ✅ Decode user details from JWT
      const decoded = jwtDecode<any>(access_token);
      const user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.user_name || decoded.email,
      };

      dispatch({
        type: LOGIN,
        payload: { user },
      });
    } catch (error: any) {
      console.error("Login failed:", error.response || error);
      throw error;
    }
  };

  const register = async (
    email: any,
    password: any,
    firstName: any,
    lastName: any
  ) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axiosServices.post("/api/account/register", {
      id,
      email,
      password,
      firstName,
      lastName,
    });
    let users = response.data;

    if (
      window.localStorage.getItem("users") !== undefined &&
      window.localStorage.getItem("users") !== null
    ) {
      const localUsers = window.localStorage.getItem("users");
      users = [
        ...(localUsers ? JSON.parse(localUsers) : []),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`,
        },
      ];
    }

    window.localStorage.setItem("users", JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node,
};

export default JWTContext;

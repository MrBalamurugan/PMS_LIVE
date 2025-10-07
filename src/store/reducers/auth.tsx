// action - state management
import { REGISTER, LOGIN, LOGOUT } from "./actions";

// Define the shape of the user
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of your state
export interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
}

// initial state
export const initialState: AuthState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

// Define action types
interface RegisterAction {
  type: typeof REGISTER;
  payload: { user: User };
}

interface LoginAction {
  type: typeof LOGIN;
  payload: { user: User };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

// Union type for all actions
type AuthAction = RegisterAction | LoginAction | LogoutAction;

// ==============================|| AUTH REDUCER ||============================== //

const auth = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user,
      };
    }
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default auth;

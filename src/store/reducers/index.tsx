// third-party
import { combineReducers } from "redux";
import organizationReducer from "../../feature/organization/organizationSlice";

// project import
import menu from "./menu";
import snackbar from "./snackbar";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,

  organization: organizationReducer,
});

export default reducers;

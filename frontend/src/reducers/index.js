import { combineReducers } from "redux";
import auth from "./auth";
import alerts from "./alerts";
import loading from "./loading";
import infobank from "./infobank"
import users from "./users"

export default combineReducers({
  auth,
  alerts,
  loading,
  infobank,
  users
});

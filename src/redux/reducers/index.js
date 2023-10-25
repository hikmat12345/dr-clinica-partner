//libs
import { combineReducers } from "redux";

//src
import AppointmentPageReducer from "./AddAppointmentPageReducer";
 
const allReducers = combineReducers({ 
  AppointmentPageReducer,
});

export default allReducers;

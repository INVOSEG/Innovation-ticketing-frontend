import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loaderReducer from "./loaderSlice";
import dashboardReducer from "./dashboardSlice";  
import ticketReducer from "./ticketSlice";

const rootReducer = combineReducers({
    loading: loaderReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    ticket : ticketReducer
});

export default rootReducer;
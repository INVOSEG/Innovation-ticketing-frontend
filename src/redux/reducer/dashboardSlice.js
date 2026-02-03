import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        option: "User Management"
    },
    reducers: {
        setDashboardOption: (state, action) => {
            return { ...state, option: action.payload };
        },
    },
});

export const { setDashboardOption } = dashboardSlice.actions;
export default dashboardSlice.reducer;
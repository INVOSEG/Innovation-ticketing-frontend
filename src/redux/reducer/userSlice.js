import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loginUser: {},

  },
  reducers: {
    setLoginUser: (state, action) => {
      return { ...state, loginUser: action.payload };
    },
  },
});

export const { setLoginUser, setUserToken } = userSlice.actions;
export default userSlice.reducer;
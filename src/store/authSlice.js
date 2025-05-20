import { createSlice } from "@reduxjs/toolkit";

// Try to get the user from localStorage (if available)
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  isLoggedIn: !!user,
  userData: user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: {
    user: null,
    csrfToken: null,
  },
  reducers: {
    initialUser(state, action) {
      state.user = action.payload.user;
      // Set CSRF token if provided
      if (action.payload.csrfToken) {
        state.csrfToken = action.payload.csrfToken;
      }
    },
    setCsrfToken(state, action) {
      state.csrfToken = action.payload;
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // no longer needed
    modifyUser(state, action) {},
  },
});
export const { initialUser, modifyUser, updateUserProfile, setCsrfToken } =
  authSlicer.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCsrfToken = (state) => state.auth.csrfToken;

export default authSlicer;

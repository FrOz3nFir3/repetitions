import { createAction, createSlice } from "@reduxjs/toolkit";
export const updateUser = createAction("updateUser", (user) => {
  return {
    payload: {
      ...user,
    },
  };
});

const authSlicer = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUser, (state, action) => {
      state.user = action.payload.user;
    });
  },
});

export const selectCurrentUser = (state) => state.auth.user;

export default authSlicer;

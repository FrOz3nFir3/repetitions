import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    initialUser(state, action) {
      state.user = action.payload.user;
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    modifyUser(state, action) {
      const updateDetails = action.payload;

      let flashCard = state.user.studying.find(
        ({ card_id }) => updateDetails.card_id == card_id
      );
      flashCard[updateDetails.type] += 1;
    },
  },
});
export const { initialUser, modifyUser, updateUserProfile } = authSlicer.actions;

export const selectCurrentUser = (state) => state.auth.user;

export default authSlicer;

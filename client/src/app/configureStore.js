import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import authSlicer from "../features/authentication/state/authSlice";
import cardSlicer from "../features/cards/state/cardSlice";

const reducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlicer.reducer,
  card: cardSlicer.reducer,
};
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

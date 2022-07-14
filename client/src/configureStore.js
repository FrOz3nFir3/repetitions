import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slice/apiSlice";
import authSlicer from "./slice/authSlice";
import cardSlicer from "./slice/cardSlice";

const reducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlicer.reducer,
  card:cardSlicer.reducer
};
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

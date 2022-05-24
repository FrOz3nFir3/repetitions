import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slice/apiSlice";
import authSlicer from "./slice/authSlice";

const reducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlicer.reducer,
};
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

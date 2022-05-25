import React from "react";
import { useGetAuthDetailsQuery } from "../slice/apiSlice";

export function useAuth(props) {
  console.log(data);

  if (isLoading == false) {
    return [data];
  } else {
    return [{ _id: null }];
  }
}

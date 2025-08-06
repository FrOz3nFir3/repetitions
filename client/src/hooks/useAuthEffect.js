import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initialUser } from "../features/authentication/state/authSlice";

const useAuthEffect = (existingUser) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (existingUser) {
      dispatch(initialUser(existingUser));
    }
  }, [existingUser, dispatch]);
};

export default useAuthEffect;

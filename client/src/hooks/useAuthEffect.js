import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initialUser } from "../features/authentication/state/authSlice";
import { isSessionPotentiallyActive } from "../utils/session";

const useAuthEffect = (postAuthDetails) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const isValidSession = isSessionPotentiallyActive();
    if (isValidSession) {
      postAuthDetails().then(({ data }) => {
        dispatch(initialUser(data));
      });
    }
  }, [postAuthDetails]);
};

export default useAuthEffect;

import { apiSlice, usePostLogoutUserMutation } from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../features/authentication/state/authSlice";
import { googleLogout } from "@react-oauth/google";
import { setSessionStatus } from "../utils/session";

const useLogout = () => {
  const [logoutUser] = usePostLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async (callback) => {
    try {
      await logoutUser().unwrap();
      googleLogout();
    } catch (err) {
      // console.error("Logout failed:", err);
    } finally {
      dispatch(apiSlice.util.resetApiState());
      dispatch(initialUser({ user: null, csrfToken: null }));
      setSessionStatus();
      if (callback && typeof callback === "function") {
        callback(false);
      }
    }
  };

  return handleLogout;
};

export default useLogout;

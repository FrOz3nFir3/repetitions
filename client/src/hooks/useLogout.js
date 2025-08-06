import { usePostLogoutUserMutation } from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../features/authentication/state/authSlice";

const useLogout = () => {
  const [logoutUser] = usePostLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async (callback) => {
    try {
      await logoutUser().unwrap();
      const gapi = await import("gapi-script").then((module) => module.gapi);
      if (gapi.auth2) {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2) {
          auth2.disconnect();
        }
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(initialUser({ user: null }));
      if (callback && typeof callback === "function") {
        callback(false);
      }
    }
  };

  return handleLogout;
};

export default useLogout;

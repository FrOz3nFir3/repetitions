import React, { useEffect } from "react";
import { usePostLogoutUserMutation } from "../../api/apiSlice";
import { initialUser } from "./authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import Loading from "../../components/common/Loading";

function Logout() {
  const [logoutUser] = usePostLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutUser().unwrap();
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
        setTimeout(() => {
          navigate("/");
        }, 1000); // Redirect after 1 second
      }
    };

    performLogout();
  }, [logoutUser, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center py-12">
      <Loading />
      <h2 className="mt-6 text-2xl font-semibold text-gray-800">Logging you out...</h2>
      <p className="mt-2 text-gray-600">You will be redirected shortly.</p>
    </div>
  );
}

export default Logout;
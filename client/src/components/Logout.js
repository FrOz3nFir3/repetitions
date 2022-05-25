import React from "react";
import { usePostLogoutUserMutation } from "../slice/apiSlice";
import { updateUser } from "../slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { gapi } from "gapi-script";

function Logout(props) {
  const [logoutUser, { isSuccess, error }] = usePostLogoutUserMutation();
  React.useEffect(() => {
    logoutUser();
    if (gapi.auth2) {
      gapi.auth2.getAuthInstance().disconnect();
    }
  }, []);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(updateUser({ user: null }));
  }, []);

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>
        {isSuccess ? "Successfully logged out" : "Not Logged in "}
      </h2>
    </div>
  );
}

export default Logout;

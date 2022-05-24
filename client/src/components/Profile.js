import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";

function Profile(props) {
  const user = useSelector(selectCurrentUser);

  if (user == null) {
    return (
      <div className="container text-center">
        <h2>Not logged in</h2>
      </div>
    );
  }
  return (
    <div className="container text-center">
      <h2>Email: {user.email}</h2>
    </div>
  );
}

export default Profile;

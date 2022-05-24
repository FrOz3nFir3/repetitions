import React from "react";
import Register from "./Register";
import Login from "./Login";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";
import LoginByGoogle from "./LoginByGoogle";

function Authentication(props) {
  const user = useSelector(selectCurrentUser);

  if (user == null) {
    return (
      <div className="container text-center flow-content">
        <div className="authentication-container grid-two-columns">
          <Login />
          <Register />
        </div>
        <LoginByGoogle />
      </div>
    );
  } else {
    return (
      <div className="text-center container">
        <h2>Already logged in! </h2>
      </div>
    );
  }
}

export default Authentication;

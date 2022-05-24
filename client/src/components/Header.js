import React from "react";
import { Link } from "react-router-dom";
import { useGetAuthDetailsQuery } from "../slice/apiSlice";
import { selectCurrentUser, updateUser } from "../slice/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Header(props) {
  const { data: existingUser, isSuccess } = useGetAuthDetailsQuery();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(updateUser(existingUser));
  }, [existingUser]);
  const user = useSelector(selectCurrentUser);

  return (
    <ul className="header flex">
      <img src="/logo.png" alt="repetitions logo" />
      <li>
        <Link to="/">Repetitions.tech</Link>
      </li>
      {isSuccess ? (
        user == null ? (
          <li>
            <Link to="/authenticate">Login / Sign Up</Link>
          </li>
        ) : (
          <>
            <li>
              <Link to={"/profile"}>Profile</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        )
      ) : (
        <li>loading..</li>
      )}
    </ul>
  );
}

export default Header;

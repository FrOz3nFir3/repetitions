import React from "react";
import { usePostLoginUserMutation } from "../slice/apiSlice";
import { useDispatch } from "react-redux";
import { updateUser } from "../slice/authSlice";
import Loading from "./Loading";

function Login() {
  const [loginUser, { data, isLoading, error }] = usePostLoginUserMutation();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateUser(data));
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // send api request
    loginUser({ email, password });
  };

  if (isLoading) {
    return <Loading count={10} />;
  }

  return (
    <div className="bg-dark-green">
      {error && <div className="bg-error">{error.data.error}</div>}
      <h2>Sign In / Login</h2>
      <form className="flow-content" onSubmit={handleSubmit}>
        <div className="flex-col">
          <label htmlFor="signin-email">Email</label>
          <input type="email" id="signin-email" required ref={emailRef} />
        </div>

        <div className="flex-col">
          <label htmlFor="signin-pass">Password</label>
          <input type="password" id="signin-pass" required ref={passwordRef} />
        </div>

        <input className="btn bg-blue-france" type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Login;

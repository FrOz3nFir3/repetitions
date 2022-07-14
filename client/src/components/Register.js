import React from "react";
import { usePostRegisterUserMutation } from "../slice/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../slice/authSlice";
import Loading from "./Loading";

function Register() {
  const [registerUser, { data, isLoading, error }] =
    usePostRegisterUserMutation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    if(data != null){
      dispatch(initialUser(data));
    }
  }, [data]);

  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const confirmPasswordRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // send api request
    registerUser({ email, password, confirmPassword });
  };

  if (isLoading) {
    return <Loading count={10} />;
  }

  return (
    <div className="bg-blue-france">
      {error && <div className="bg-error">{error.data.error}</div>}
      <h2>Sign Up / Register</h2>
      <form className="flow-content" onSubmit={handleSubmit}>
        <div className="flex-col">
          <label htmlFor="signup-email">Email</label>
          <input type="email" id="signup-email" required ref={emailRef} />
        </div>

        <div className="flex-col">
          <label htmlFor="signup-pass">Password</label>
          <input type="password" id="signup-pass" required ref={passwordRef} />
        </div>

        <div className="flex-col">
          <label htmlFor="signup-confirm-pass">Confirm Password</label>
          <input
            type="password"
            id="signup-confirm-pass"
            required
            ref={confirmPasswordRef}
          />
        </div>
        <input className="btn" type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Register;

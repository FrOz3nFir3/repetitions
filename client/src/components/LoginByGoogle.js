import React from "react";
import { usePostGoogleLoginMutation } from "../slice/apiSlice";
import { useDispatch } from "react-redux";
import { updateUser } from "../slice/authSlice";
const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";
import { GoogleLogin } from "react-google-login";
import Loading from "./Loading";

function LoginByGoogle(props) {
  const [loginWithGoogle, { isFetching, error, data }] =
    usePostGoogleLoginMutation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(updateUser(data));
  }, [data]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      {error && error.data.error}
      <GoogleLogin
        clientId={clientId}
        buttonText="Login With Google"
        onSuccess={successfulLogin}
        onFailure={unsuccessfulLogin}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );

  // hoisting
  function successfulLogin(data) {
    const email = data.profileObj.email;
    loginWithGoogle({ email });
  }
  function unsuccessfulLogin(data) {
    loginWithGoogle(data);
  }
}

export default LoginByGoogle;

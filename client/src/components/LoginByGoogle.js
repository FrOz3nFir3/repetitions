import React from "react";
import { usePostGoogleLoginMutation } from "../slice/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../slice/authSlice";
import { GoogleLogin } from "react-google-login";
import Loading from "./Loading";

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";
function LoginByGoogle(props) {
  const [loginWithGoogle, { isFetching, error, data }] =
    usePostGoogleLoginMutation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    if(data != null){
      dispatch(initialUser(data));
    }
  }, [data]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      {error && <div className="bg-error"> {error.data.error}</div>}
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

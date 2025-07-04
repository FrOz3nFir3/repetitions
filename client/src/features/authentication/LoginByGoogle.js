import React from "react";
import { usePostGoogleLoginMutation } from "../../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "./authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Loading from "../../components/common/Loading";
import { jwtDecode } from "jwt-decode";

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";

function LoginByGoogle(props) {
  const [loginWithGoogle, { isFetching, error, data }] =
    usePostGoogleLoginMutation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (data != null) {
      dispatch(initialUser(data));
    }
  }, [data]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center justify-center">
        {error && <div className="bg-error"> {error.data.error}</div>}
        <GoogleLogin onSuccess={successfulLogin} onError={unsuccessfulLogin} />
      </div>
    </GoogleOAuthProvider>
  );

  // hoisting
  function successfulLogin(credentialResponse) {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;
    loginWithGoogle({ email });
  }
  function unsuccessfulLogin() {
    console.log("Login Failed");
  }
}

export default LoginByGoogle;

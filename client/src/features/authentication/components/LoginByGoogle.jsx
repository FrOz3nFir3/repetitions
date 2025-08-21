import React, { Suspense, lazy } from "react";
import { usePostGoogleLoginMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../state/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginByGoogleSkeleton from "../../../components/ui/skeletons/LoginByGoogleSkeleton";
import { jwtDecode } from "jwt-decode";
import { setSessionStatus } from "../../../utils/session";

const GoogleLogin = lazy(() =>
  import("@react-oauth/google").then((module) => ({
    default: module.GoogleLogin,
  }))
);

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";

function LoginByGoogle(props) {
  const [loginWithGoogle, { isFetching, error, data }] =
    usePostGoogleLoginMutation();

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (data != null) {
      dispatch(initialUser(data));
      setSessionStatus(true);
    }
  }, [data]);

  if (isFetching) {
    return <LoginByGoogleSkeleton />;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center justify-center">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error?.data?.error}
          </div>
        )}
        <Suspense fallback={<LoginByGoogleSkeleton />}>
          <GoogleLogin
            onSuccess={successfulLogin}
            onError={unsuccessfulLogin}
            useOneTap
          />
        </Suspense>
      </div>
    </GoogleOAuthProvider>
  );

  // hoisting
  function successfulLogin(credentialResponse) {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;
    const name = decoded.name;
    const googleId = decoded.sub;
    loginWithGoogle({ name, email, googleId });
  }
  function unsuccessfulLogin() {
    // handle this later
    // console.log("Login Failed");
  }
}

export default LoginByGoogle;

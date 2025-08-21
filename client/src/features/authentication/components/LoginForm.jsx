import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostLoginUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import AuthInput from "./ui/AuthInput";
import AuthSubmitButton from "./ui/AuthSubmitButton";
import AuthErrorDisplay from "./ui/AuthErrorDisplay";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { setSessionStatus } from "../../../utils/session";

const LoginForm = () => {
  const [loginUser, { data, isLoading, error }] = usePostLoginUserMutation();
  const loginIdentifierRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(initialUser(data));
      setSessionStatus(true);
    }
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginIdentifier = loginIdentifierRef.current.value;
    const password = passwordRef.current.value;
    loginUser({ loginIdentifier, password });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthErrorDisplay error={error} />

      <div className="space-y-4">
        <AuthInput
          id="loginIdentifier"
          label="Email or Username"
          Icon={AtSymbolIcon}
          ref={loginIdentifierRef}
          name="loginIdentifier"
          type="text"
          autoComplete="email"
          placeholder="Enter your email or username"
          required
          disabled={isLoading}
        />

        <AuthInput
          id="password"
          label="Password"
          Icon={LockClosedIcon}
          ref={passwordRef}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>

      <AuthSubmitButton
        isLoading={isLoading}
        loadingText="Signing in..."
        buttonText="Sign in to your account"
        Icon={ArrowRightOnRectangleIcon}
      />
    </form>
  );
};

export default LoginForm;

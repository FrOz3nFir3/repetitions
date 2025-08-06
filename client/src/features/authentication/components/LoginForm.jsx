import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostLoginUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import AuthInput from "./ui/AuthInput";
import AuthSubmitButton from "./ui/AuthSubmitButton";
import AuthErrorDisplay from "./ui/AuthErrorDisplay";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const LoginForm = () => {
  const [loginUser, { data, isLoading, error }] = usePostLoginUserMutation();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(initialUser(data));
    }
  }, [data, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    loginUser({ email, password });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthErrorDisplay error={error} />

      <div className="space-y-4">
        <AuthInput
          id="email"
          label="Email address"
          Icon={AtSymbolIcon}
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
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

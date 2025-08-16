import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostRegisterUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import AuthInput from "./ui/AuthInput";
import AuthSubmitButton from "./ui/AuthSubmitButton";
import AuthErrorDisplay from "./ui/AuthErrorDisplay";
import {
  UserIcon,
  UserPlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const RegisterForm = () => {
  const [registerUser, { data, isLoading, error }] =
    usePostRegisterUserMutation();
  const dispatch = useDispatch();
  const nameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (data) {
      dispatch(initialUser(data));
    }
  }, [data, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    registerUser({ name, username, email, password, confirmPassword });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthErrorDisplay error={error} />

      <div className="space-y-4">
        <AuthInput
          id="name-register"
          label="Full Name"
          Icon={UserIcon}
          ref={nameRef}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          required
          disabled={isLoading}
        />

        <AuthInput
          id="username-register"
          label="Username"
          Icon={UserCircleIcon}
          ref={usernameRef}
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Choose a unique username"
          required
          disabled={isLoading}
        />

        <AuthInput
          id="email-register"
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

        <div className="grid grid-cols-1  gap-4">
          <AuthInput
            id="password-register"
            label="Password"
            Icon={LockClosedIcon}
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            required
            disabled={isLoading}
          />

          <AuthInput
            id="confirm-password-register"
            label="Confirm Password"
            Icon={LockClosedIcon}
            ref={confirmPasswordRef}
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <AuthSubmitButton
        isLoading={isLoading}
        loadingText="Creating account..."
        buttonText="Create your account"
        Icon={UserPlusIcon}
      />
    </form>
  );
};

export default RegisterForm;

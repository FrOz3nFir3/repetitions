import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostRegisterUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import Loading from "../../../components/ui/Loading";
import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

const commonInputClass =
  "block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-12 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

const RegisterForm = () => {
  const [registerUser, { data, isLoading, error }] =
    usePostRegisterUserMutation();
  const dispatch = useDispatch();
  const nameRef = useRef();
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
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    registerUser({ name, email, password, confirmPassword });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.data.error}
        </div>
      )}
      <div>
        <label htmlFor="name-register" className="sr-only">
          Name
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name-register"
            name="name"
            type="text"
            autoComplete="name"
            required
            ref={nameRef}
            className={commonInputClass}
            placeholder="Full Name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email-register" className="sr-only">
          Email address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <AtSymbolIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email-register"
            name="email"
            type="email"
            autoComplete="email"
            required
            ref={emailRef}
            className={commonInputClass}
            placeholder="Email address"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password-register" className="sr-only">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password-register"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            ref={passwordRef}
            className={commonInputClass}
            placeholder="Password"
          />
        </div>
      </div>
      <div>
        <label htmlFor="confirm-password-register" className="sr-only">
          Confirm Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirm-password-register"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            ref={confirmPasswordRef}
            className={commonInputClass}
            placeholder="Confirm Password"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
          {isLoading ? <Loading count={1} /> : "Create account"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;

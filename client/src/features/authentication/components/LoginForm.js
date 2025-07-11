import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostLoginUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import {
  AtSymbolIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const commonInputClass =
  "block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-12 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-600";

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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.data.error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <AtSymbolIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            ref={emailRef}
            className={commonInputClass}
            placeholder="Email address"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            ref={passwordRef}
            className={commonInputClass}
            placeholder="Password"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

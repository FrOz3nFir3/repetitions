import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostRegisterUserMutation } from "../../../api/apiSlice";
import { initialUser } from "../state/authSlice";
import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const commonInputClass =
  "block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 pl-12 py-4 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 sm:text-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500";

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
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error.data.error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name-register"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name
          </label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              id="name-register"
              name="name"
              type="text"
              autoComplete="name"
              required
              ref={nameRef}
              className={commonInputClass}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email-register"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email address
          </label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <AtSymbolIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              id="email-register"
              name="email"
              type="email"
              autoComplete="email"
              required
              ref={emailRef}
              className={commonInputClass}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1  gap-4">
          <div>
            <label
              htmlFor="password-register"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                id="password-register"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                ref={passwordRef}
                className={commonInputClass}
                placeholder="Create password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password-register"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                id="confirm-password-register"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                ref={confirmPasswordRef}
                className={commonInputClass}
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <svg
                className="h-5 w-5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            )}
          </span>
          {isLoading ? "Creating account..." : "Create your account"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;

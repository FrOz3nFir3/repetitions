import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  usePostLoginUserMutation,
  usePostRegisterUserMutation,
} from "../../api/apiSlice";
import { initialUser, selectCurrentUser } from "./authSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import LoginByGoogle from "./LoginByGoogle";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";

function Authentication() {
  const user = useSelector(selectCurrentUser);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;
    // redirect to home if user is already logged in
    navigate("/");
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome to Repetitions
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          The smart way to learn and retain knowledge.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-2xl rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-4 text-center font-medium text-sm transition-colors ${
                  isLogin
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-4 text-center font-medium text-sm transition-colors ${
                  !isLogin
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <LoginByGoogle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const commonInputClass =
  "block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-12 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

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
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
          {isLoading ? <Loading /> : "Sign in"}
        </button>
      </div>
    </form>
  );
};

const RegisterForm = () => {
  const [registerUser, { data, isLoading, error }] =
    usePostRegisterUserMutation();
  const dispatch = useDispatch();
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
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    registerUser({ email, password, confirmPassword });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.data.error}
        </div>
      )}
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
          {isLoading ? <Loading /> : "Create account"}
        </button>
      </div>
    </form>
  );
};

export default Authentication;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../state/authSlice";
import { useNavigate } from "react-router-dom";
import LoginByGoogle from "../components/LoginByGoogle";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthenticationPage() {
  const user = useSelector(selectCurrentUser);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      // redirect to home if user is already logged in
      navigate("/");
    }
  }, [user, navigate]);

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

export default AuthenticationPage;

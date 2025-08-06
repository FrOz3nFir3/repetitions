import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GuestAccessNote from "./GuestAccessNote";
import SocialAuthDivider from "./SocialAuthDivider";
import LoginByGoogle from "./LoginByGoogle";

const AuthFormCard = ({ isLogin, onTabChange }) => {
  return (
    <div className="sticky top-8">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? "Welcome Back!" : "Start Learning Today"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin
              ? "Continue your learning journey"
              : "Begin your journey with Repetitions"}
          </p>
        </div>

        <GuestAccessNote />

        <div className="mb-6">
          <AuthTabs isLogin={isLogin} onTabChange={onTabChange} />
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6">
          <SocialAuthDivider />
          <div className="mt-6">
            <LoginByGoogle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormCard;

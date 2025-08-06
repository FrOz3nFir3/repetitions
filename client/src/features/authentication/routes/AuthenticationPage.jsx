import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../state/authSlice";
import { useNavigate } from "react-router-dom";
import LoginByGoogle from "../components/LoginByGoogle";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AuthTabs from "../components/AuthTabs";
import BenefitsSection from "../components/BenefitsSection"; // Import the new component
import {
  EyeIcon, // Keep EyeIcon for Guest Access Note
  UserCircleIcon, // Keep UserCircleIcon for Auth Form Header
} from "@heroicons/react/24/outline";

function AuthenticationPage() {
  const user = useSelector(selectCurrentUser);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
              Master Any Subject
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Transform your learning with intelligent flashcards and spaced
            repetition.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Benefits Section - Now a separate component */}
          <BenefitsSection />

          {/* Authentication Form - Takes 1 column */}
          <div className="lg:col-span-1">
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
                {/* Guest Access Note */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700/50 dark:to-indigo-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start space-x-3">
                    <EyeIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Try Before You Commit
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Browse flashcards and take quizzes as a guest. Create an
                        account when you're ready to unlock all features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <AuthTabs isLogin={isLogin} onTabChange={setIsLogin} />
                </div>

                {isLogin ? <LoginForm /> : <RegisterForm />}

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
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
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;

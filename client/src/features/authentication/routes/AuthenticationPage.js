import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../state/authSlice";
import { useNavigate } from "react-router-dom";
import LoginByGoogle from "../components/LoginByGoogle";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AuthTabs from "../components/AuthTabs";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  ChartBarIcon,
  EyeIcon,
  UserCircleIcon,
  ClockIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XMarkIcon,
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

  const guestFeatures = [
    {
      icon: EyeIcon,
      title: "View Cards",
      description: "Browse and access existing flashcards",
      available: true,
    },
    {
      icon: ClockIcon,
      title: "Take Quizzes",
      description: "Practice with spaced repetition",
      available: true,
    },
    {
      icon: PlusCircleIcon,
      title: "Create Cards",
      description: "Build your own flashcard collections",
      available: false,
    },
    {
      icon: PencilSquareIcon,
      title: "Edit Cards",
      description: "Modify and improve existing cards",
      available: false,
    },
    {
      icon: ChartBarIcon,
      title: "Track Progress",
      description: "View detailed performance analytics",
      available: false,
    },
    {
      icon: UserCircleIcon,
      title: "Activity Timeline",
      description: "See your contributions and history",
      available: false,
    },
  ];

  const memberFeatures = [
    {
      icon: EyeIcon,
      title: "View Cards",
      description: "Browse and access all flashcards",
      available: true,
    },
    {
      icon: ClockIcon,
      title: "Take Quizzes",
      description: "Practice with advanced spaced repetition",
      available: true,
    },
    {
      icon: PlusCircleIcon,
      title: "Create Cards",
      description: "Build unlimited flashcard collections",
      available: true,
    },
    {
      icon: PencilSquareIcon,
      title: "Edit Cards",
      description: "Modify any cards with attribution",
      available: true,
    },
    {
      icon: ChartBarIcon,
      title: "Track Progress",
      description: "Detailed analytics and performance insights",
      available: true,
    },
    {
      icon: UserCircleIcon,
      title: "Activity Timeline",
      description: "Your name, email appears in edit history",
      available: true,
    },
  ];

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
          {/* Benefits Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Feature Comparison Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Guest Features */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-fit">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4">
                    <EyeIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Try It Free
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No signup required
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {guestFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {feature.available ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className={feature.available ? "" : "opacity-60"}>
                        <div className="flex items-center mb-1">
                          <feature.icon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </h4>
                          {!feature.available && (
                            <LockClosedIcon className="w-3 h-3 ml-2 text-red-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Member Features */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-700 relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  UNLOCK ALL
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Full Access
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      Everything included
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {memberFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <feature.icon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 ml-6">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Benefits Highlight */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                🚀 Why Join Our Learning Community?
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PlusCircleIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Create & Share
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Build unlimited flashcard decks and contribute to the
                      community
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Track Progress
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Detailed analytics show your learning journey and
                      improvements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PencilSquareIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Edit & Improve
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enhance any card with your name, email credited in the
                      activity timeline
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCircleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Own Your Content
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Full control over cards you create, including deletion
                      rights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

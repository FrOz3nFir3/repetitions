import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { usePatchUpdateUserProfileMutation } from "../../../api/apiSlice";
import ProfileSkeleton from "../../../components/ui/skeletons/ProfilePageSkeleton";
import {
  selectCurrentUser,
  updateUserProfile,
} from "../../authentication/state/authSlice";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";

import {
  ShieldCheckIcon,
  UserCircleIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const ProfileContent = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { isLoading, error: apiError }] =
    usePatchUpdateUserProfileMutation();

  const nameRef = useRef(user?.name);
  const emailRef = useRef(user?.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: nameRef.current.value,
      email: emailRef.current.value,
    };

    updateUser(updatedUser).then((response) => {
      if (response.error) return;
      dispatch(updateUserProfile(updatedUser));
      setIsEditing(false);
    });
  };

  const handleGoogleConnectSuccess = async (tokenResponse) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const googleUser = await response.json();
      const updatedUser = { googleId: googleUser.sub };

      const { error } = await updateUser(updatedUser);
      if (error) return;
      dispatch(updateUserProfile(updatedUser));
    } catch (error) {
      // console.error("Failed to connect Google account:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleConnectSuccess,
    onError: () => {
      // handle this later
      // console.log("Google Connect Failed")
    },
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!user)
    return (
      <RestrictedAccess description="You need to be logged in to view your profile" />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Header with Profile Icon */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <UserCircleIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <StarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                Account Settings
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Manage your profile information and connected accounts
            </p>
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {apiError.data.error}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Profile Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Update your personal details
                    </p>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <PencilIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Edit Your Profile
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Make changes to your account information
                        </p>
                      </div>

                      {/* Enhanced Edit Form */}
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Full Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="name"
                                ref={nameRef}
                                defaultValue={user.name}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="Enter your full name"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Email Address
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                id="email"
                                ref={emailRef}
                                defaultValue={user.email}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="Enter your email address"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {isLoading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Saving Changes...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Save Changes
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 cursor-pointer inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Profile Display */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Full Name
                          </label>
                          <p className="text-xl font-medium text-gray-900 dark:text-white">
                            {user.name || "Not provided"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Email Address
                          </label>
                          <p className="text-xl font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <PencilIcon className="w-5 h-5 mr-2" />
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Accounts Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Social Header */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <LinkIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      Connected Accounts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Link your social accounts
                    </p>
                  </div>
                </div>

                {/* Enhanced Social Accounts */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Google Account */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Google
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sign in with Google account
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        {user.googleId ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                            <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              Active
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                              <XCircleIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Not linked
                              </span>
                            </div>

                            <button
                              onClick={login}
                              className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              Connect
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Future social accounts placeholder */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 opacity-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 dark:text-gray-400">
                              More platforms
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Coming soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;

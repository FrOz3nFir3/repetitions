import React, { useState, useEffect, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePatchUpdateUserProfileMutation } from "../../api/apiSlice";
import ProfileSkeleton from "../../components/skeletons/ProfileSkeleton";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { updateUserProfile } from "../authentication/authSlice";
import RestrictedAccess from "../../components/common/RestrictedAccess";

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";

const ProfileContent = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { isLoading, error: apiError }] =
    usePatchUpdateUserProfileMutation();

  const nameRef = useRef(user?.name);
  const emailRef = useRef(user?.email);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // No need to reset refs, they will be updated by the useEffect
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const updatedUser = {
      name,
      email,
    };
    updateUser(updatedUser).then((response) => {
      console.log(response);
      if (response.error) return;
      dispatch(updateUserProfile(updatedUser));
      setIsEditing(false);
    });
  };

  const handleGoogleConnectSuccess = async (tokenResponse) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      const googleUser = await response.json();
      const updatedUser = {
        googleId: googleUser.sub,
      };

      const { error } = await updateUser(updatedUser);
      if (error) return;
      dispatch(updateUserProfile(updatedUser));
    } catch (error) {
      console.error("Failed to connect Google account:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleConnectSuccess,
    onError: () => console.log("Google Connect Failed"),
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user && !isLoading) {
    return (
      <RestrictedAccess
        description={`You need to be logged in to view your profile`}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Profile
        </h1>

        {apiError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 mb-4">
            {apiError.data.error}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Name
              </h2>
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Email
              </h2>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <button
              onClick={handleEdit}
              className="cursor-pointer mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                defaultValue={user.name}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                defaultValue={user.email}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-start space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Social Accounts
          </h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-10 h-10 mr-2" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 6.627 5.373 12 12 12z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
                <span className="text-2xl text-gray-900 dark:text-white">
                  Google
                </span>
              </div>
              {user.googleId ? (
                <button className="pointer-events-none px-4 py-2 bg-green-500 text-white rounded-md ">
                  Connected
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <GoogleOAuthProvider clientId={clientId}>
      <ProfileContent />
    </GoogleOAuthProvider>
  </Suspense>
);

export default Profile;

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePatchUpdateUserProfileMutation } from "../../../api/apiSlice";
import ProfileSkeleton from "../../../components/ui/skeletons/ProfilePageSkeleton";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import {
  selectCurrentUser,
  updateUserProfile,
} from "../../authentication/state/authSlice";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import ProfileView from "../components/ProfileView";
import ProfileEditForm from "../components/ProfileEditForm";
import SocialAccounts from "../components/SocialAccounts";

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";

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
      console.error("Failed to connect Google account:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleConnectSuccess,
    onError: () => console.log("Google Connect Failed"),
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!user)
    return (
      <RestrictedAccess description="You need to be logged in to view your profile" />
    );

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

        {isEditing ? (
          <ProfileEditForm
            user={user}
            nameRef={nameRef}
            emailRef={emailRef}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        ) : (
          <ProfileView user={user} onEdit={() => setIsEditing(true)} />
        )}

        <SocialAccounts user={user} onConnectGoogle={login} />
      </div>
    </div>
  );
};

const ProfilePage = () => (
  <GoogleOAuthProvider clientId={clientId}>
    <ProfileContent />
  </GoogleOAuthProvider>
);

export default ProfilePage;

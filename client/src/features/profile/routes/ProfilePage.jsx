import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProfileContent from "../components/ProfileContent";

const clientId =
  "650317328714-q5a463tj89sgofpglmp6p4m9697tmcqk.apps.googleusercontent.com";

const ProfilePage = () => (
  <GoogleOAuthProvider clientId={clientId}>
    <ProfileContent />
  </GoogleOAuthProvider>
);

export default ProfilePage;

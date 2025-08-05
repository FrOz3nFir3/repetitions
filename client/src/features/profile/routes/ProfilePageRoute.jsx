import React, { Suspense, lazy } from "react";
import ProfilePageSkeleton from "../../../components/ui/skeletons/ProfilePageSkeleton";

const ProfilePage = lazy(() => import("./ProfilePage"));

const ProfilePageRoute = () => (
  <Suspense fallback={<ProfilePageSkeleton />}>
    <ProfilePage />
  </Suspense>
);

export default ProfilePageRoute;

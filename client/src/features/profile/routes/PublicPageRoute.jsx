import React, { Suspense, lazy } from "react";
import PublicProfilePageSkeleton from "../../../components/ui/skeletons/PublicProfilePageSkeleton";

const PublicProfilePage = lazy(() => import("./PublicProfilePage"));

const PublicPageRoute = () => (
  <Suspense fallback={<PublicProfilePageSkeleton />}>
    <PublicProfilePage />
  </Suspense>
);

export default PublicPageRoute;

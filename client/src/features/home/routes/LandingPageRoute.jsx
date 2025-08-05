import React, { Suspense, lazy } from "react";
import LandingPageSkeleton from "../../../components/ui/skeletons/LandingPageSkeleton";

const LandingPage = lazy(() => import("./LandingPage"));

const LandingPageRoute = () => (
  <Suspense fallback={<LandingPageSkeleton />}>
    <LandingPage />
  </Suspense>
);

export default LandingPageRoute;

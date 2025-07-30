import React, { Suspense, lazy } from "react";
import ProgressPageSkeleton from "../../../components/ui/skeletons/ProgressPageSkeleton";

const ProgressPage = lazy(() => import("./ProgressPage"));

const ProgressPageRoute = () => (
  <Suspense fallback={<ProgressPageSkeleton />}>
    <ProgressPage />
  </Suspense>
);

export default ProgressPageRoute;

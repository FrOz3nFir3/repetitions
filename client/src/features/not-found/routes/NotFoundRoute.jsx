import React, { Suspense, lazy } from "react";
import NotFoundPageSkeleton from "../../../components/ui/skeletons/NotFoundPageSkeleton";

const NotFoundPage = lazy(() => import("./NotFoundPage"));

const NotFoundRoute = () => (
  <Suspense fallback={<NotFoundPageSkeleton />}>
    <NotFoundPage />
  </Suspense>
);

export default NotFoundRoute;
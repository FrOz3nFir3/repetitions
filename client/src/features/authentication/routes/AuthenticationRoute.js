import React, { Suspense, lazy } from "react";
import AuthenticationPageSkeleton from "../../../components/ui/skeletons/AuthenticationPageSkeleton";

const AuthenticationPage = lazy(() => import("./AuthenticationPage"));

const AuthenticationRoute = () => (
  <Suspense fallback={<AuthenticationPageSkeleton />}>
    <AuthenticationPage />
  </Suspense>
);

export default AuthenticationRoute;

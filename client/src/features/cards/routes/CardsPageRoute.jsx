import React, { Suspense, lazy } from "react";
import CardsPageSkeleton from "../../../components/ui/skeletons/CardsPageSkeleton";

const CardsPage = lazy(() => import("./CardsPage"));

const CardsPageRoute = () => (
  <Suspense fallback={<CardsPageSkeleton />}>
    <CardsPage />
  </Suspense>
);

export default CardsPageRoute;

import React, { Suspense, lazy } from "react";
import EditCardPageSkeleton from "../../../components/ui/skeletons/EditCardPageSkeleton";
import CardActions from "../components/CardActions";

const EditCard = lazy(() => import("../components/EditCard/EditCardView"));

const EditCardRoute = () => (
  <Suspense fallback={<EditCardPageSkeleton />}>
    <div className="space-y-6">
      <EditCard />
      <CardActions showInfo />
    </div>
  </Suspense>
);

export default EditCardRoute;
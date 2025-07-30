import React, { Suspense, lazy } from "react";
import ReviewPageSkeleton from "../../../components/ui/skeletons/ReviewPageSkeleton";
import CardActions from "../components/CardActions";

const Review = lazy(() => import("../components/Flashcard/ReviewView"));

const ReviewRoute = () => (
  <Suspense fallback={<ReviewPageSkeleton />}>
    <div className="space-y-6">
      <Review />
      <CardActions showInfo />
    </div>
  </Suspense>
);

export default ReviewRoute;
import React, { Suspense, lazy } from "react";
import QuizPageSkeleton from "../../../components/ui/skeletons/QuizPageSkeleton";
import CardActions from "../components/CardActions";

const Quiz = lazy(() => import("../components/Quiz/QuizView"));

const QuizRoute = () => (
  <Suspense fallback={<QuizPageSkeleton />}>
    <div className="space-y-6">
      <Quiz />
      <CardActions showInfo />
    </div>
  </Suspense>
);

export default QuizRoute;
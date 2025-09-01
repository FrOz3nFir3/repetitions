import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import IndividualCardPage from "./IndividualCardPage"; // Eager load the layout component
import CardActions from "../components/CardActions";
import NotFound from "../../not-found/components/NotFound";

// Standalone routes that manage their own data fetching
const StandaloneReviewRoute = lazy(() => import("./StandaloneReviewRoute"));
const StandaloneFocusReviewRoute = lazy(() =>
  import("./StandaloneFocusReviewRoute")
);
const StandaloneQuizRoute = lazy(() => import("./StandaloneQuizRoute"));
const StandaloneFocusQuizRoute = lazy(() =>
  import("./StandaloneFocusQuizRoute")
);

// Outlet-based routes that benefit from shared layout
const EditCardRoute = lazy(() => import("./EditCardRoute"));

const IndividualCardPageRoute = () => (
  <Routes>
    {/* Standalone routes with full-screen experience */}
    <Route path="review" element={<StandaloneReviewRoute />} />
    <Route path="focus-review" element={<StandaloneFocusReviewRoute />} />
    <Route path="quiz" element={<StandaloneQuizRoute />} />
    <Route path="focus-quiz" element={<StandaloneFocusQuizRoute />} />

    {/* Outlet-based routes that benefit from shared layout */}
    <Route element={<IndividualCardPage />}>
      <Route
        index
        element={
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Ready to Learn?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Choose your learning adventure and start mastering your content!
              </p>
            </div>
            <div className="mt-8">
              <CardActions layout="horizontal" isRelative />
            </div>
          </div>
        }
      />
      <Route path="edit" element={<EditCardRoute />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default IndividualCardPageRoute;

import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import IndividualCardPage from "./IndividualCardPage"; // Eager load the layout component
import CardActions from "../components/CardActions";

// Lazy load the content of the outlet
const ReviewRoute = lazy(() => import("./ReviewRoute"));
const QuizRoute = lazy(() => import("./QuizRoute"));
const EditCardRoute = lazy(() => import("./EditCardRoute"));

const IndividualCardPageRoute = () => (
  <Routes>
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
      <Route path="review" element={<ReviewRoute />} />
      <Route path="quiz" element={<QuizRoute />} />
      <Route path="edit" element={<EditCardRoute />} />
    </Route>
  </Routes>
);

export default IndividualCardPageRoute;

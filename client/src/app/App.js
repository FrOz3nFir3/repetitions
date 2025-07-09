import React, { Suspense, lazy } from "react";
import Header from "../components/common/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/common/NotFound";

import LandingPage from "../features/home/LandingPage";
import LandingPageSkeleton from "../features/home/LandingPageSkeleton";

const Category = lazy(() => import("../features/category/Category"));
import CategorySkeleton from "../components/skeletons/CategorySkeleton";
const Cards = lazy(() => import("../features/cards/Cards"));

const Individual = lazy(() => import("../features/cards/Individual"));
import IndividualSkeleton from "../components/skeletons/IndividualSkeleton";
const Review = lazy(() => import("../features/review/Review"));
const Quiz = lazy(() => import("../features/quiz/Quiz"));
const EditCard = lazy(() => import("../features/cards/EditCard"));

const Authentication = lazy(() =>
  import("../features/authentication/Authentication")
);
const Profile = lazy(() => import("../features/profile/Profile"));
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Suspense fallback={<LandingPageSkeleton />}>
                <LandingPage />
              </Suspense>
            }
          />

          <Route
            path="/category"
            element={
              <Suspense fallback={<CategorySkeleton />}>
                <Category />
              </Suspense>
            }
          >
            <Route path=":name" element={<Cards />} />
          </Route>

          <Route
            exact
            path="card/:id"
            element={
              <Suspense fallback={<IndividualSkeleton />}>
                <Individual />
              </Suspense>
            }
          >
            <Route path="review" element={<Review />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="edit" element={<EditCard />} />
          </Route>

          <Route
            path="profile"
            element={
              <Suspense fallback={<ProfileSkeleton />}>
                <Profile />
              </Suspense>
            }
          />

          <Route path="authenticate" element={<Authentication />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

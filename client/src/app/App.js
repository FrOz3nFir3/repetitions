import React, { Suspense, lazy } from "react";
import Header from "../components/layout/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/ui/NotFound";

import LandingPage from "../features/home/routes/LandingPage";
import LandingPageSkeleton from "../components/ui/skeletons/LandingPageSkeleton";

const CategoryPage = lazy(() =>
  import("../features/cards/routes/CategoryPage")
);
import CategoryPageSkeleton from "../components/ui/skeletons/CategoryPageSkeleton";
const CardsList = lazy(() => import("../features/cards/components/CardsList"));

const IndividualCardPage = lazy(() =>
  import("../features/cards/routes/IndividualCardPage")
);
import IndividualCardPageSkeleton from "../components/ui/skeletons/IndividualCardPageSkeleton";
const Review = lazy(() =>
  import("../features/cards/components/Flashcard/ReviewView")
);
const Quiz = lazy(() => import("../features/cards/components/Quiz/QuizView"));
const EditCard = lazy(() =>
  import("../features/cards/components/EditCard/EditCardView")
);

const AuthenticationPage = lazy(() =>
  import("../features/authentication/routes/AuthenticationPage")
);
const ProgressPage = lazy(() =>
  import("../features/progress/routes/ProgressPage")
);
import ProgressPageSkeleton from "../components/ui/skeletons/ProgressPageSkeleton";
const ProfilePage = lazy(() =>
  import("../features/profile/routes/ProfilePage")
);
import ProfilePageSkeleton from "../components/ui/skeletons/ProfilePageSkeleton";

const NotFoundPage = lazy(() =>
  import("../features/not-found/routes/NotFoundPage")
);

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
              <Suspense fallback={<CategoryPageSkeleton />}>
                <CategoryPage />
              </Suspense>
            }
          >
            <Route path=":name" element={<CardsList />} />
          </Route>

          <Route
            exact
            path="card/:id"
            element={
              <Suspense fallback={<IndividualCardPageSkeleton />}>
                <IndividualCardPage />
              </Suspense>
            }
          >
            <Route path="review" element={<Review />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="edit" element={<EditCard />} />
          </Route>

          <Route
            path="progress"
            element={
              <Suspense fallback={<ProgressPageSkeleton />}>
                <ProgressPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<ProfilePageSkeleton />}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route path="authenticate" element={<AuthenticationPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

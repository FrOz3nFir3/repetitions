import React, { Suspense, lazy } from "react";
import Header from "../components/common/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/common/NotFound";
import Loading from "../components/common/Loading";

import LandingPage from "../features/home/LandingPage";
const Individual = lazy(() => import("../features/cards/Individual"));
const Review = lazy(() => import("../features/review/Review"));
const Quiz = lazy(() => import("../features/quiz/Quiz"));
const Cards = lazy(() => import("../features/cards/Cards"));
const Authentication = lazy(() =>
  import("../features/authentication/Authentication")
);

const Profile = lazy(() => import("../features/profile/Profile"));
const Category = lazy(() => import("../features/category/Category"));
const EditCard = lazy(() => import("../features/cards/EditCard"));

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />

          <Route path="/category" element={<Category />}>
            <Route path=":name" element={<Cards />} />
          </Route>

          <Route exact path="card/:id" element={<Individual />}>
            <Route path="review" element={<Review />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="edit" element={<EditCard />} />
          </Route>

          <Route path="profile" element={<Profile />} />

          <Route path="authenticate" element={<Authentication />} />

          

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

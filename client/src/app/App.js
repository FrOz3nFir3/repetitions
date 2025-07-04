import React from "react";
import Header from "../components/common/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/common/NotFound";
import Individual from "../features/cards/Individual";
import { Review } from "../features/review/Review";
import { Quiz } from "../features/quiz/Quiz";
import Cards from "../features/cards/Cards";
import Authentication from "../features/authentication/Authentication";
import Logout from "../features/authentication/Logout";
import Profile from "../features/profile/Profile";
import LandingPage from "../features/home/LandingPage";
import Category from "../features/category/Category";
import EditCard from "../features/cards/EditCard";

function App() {
  return (
    <BrowserRouter>
      <Header />
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

        <Route path="logout" element={<Logout />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

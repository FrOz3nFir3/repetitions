import React from "react";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import Individual from "./Individual";
import { Review } from "./Review";
import { Quiz } from "./Quiz";
import Cards from "./Cards";
import Authentication from "./Authentication";
import Logout from "./Logout";
import Profile from "./Profile";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route path="category/:name" element={<Cards />} />
        </Route>

        <Route exact path="card/:id" element={<Individual />}>
          <Route path="review" element={<Review />} />
          <Route path="quiz" element={<Quiz />} />
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

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../components/layout/Header/Header";

// Lazy-loaded route wrappers
const LandingPageRoute = lazy(() =>
  import("../features/home/routes/LandingPageRoute")
);
const CategoryPageRoute = lazy(() =>
  import("../features/cards/routes/CategoryPageRoute")
);
const IndividualCardPageRoute = lazy(() =>
  import("../features/cards/routes/IndividualCardPageRoute")
);
const ProgressPageRoute = lazy(() =>
  import("../features/progress/routes/ProgressPageRoute")
);
const ProfilePageRoute = lazy(() =>
  import("../features/profile/routes/ProfilePageRoute")
);
const AuthenticationRoute = lazy(() =>
  import("../features/authentication/routes/AuthenticationRoute")
);
const NotFoundRoute = lazy(() =>
  import("../features/not-found/routes/NotFoundRoute")
);

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPageRoute />} />
          <Route path="/category/*" element={<CategoryPageRoute />} />
          <Route path="/card/:id/*" element={<IndividualCardPageRoute />} />
          <Route path="/progress" element={<ProgressPageRoute />} />
          <Route path="/profile" element={<ProfilePageRoute />} />
          <Route path="/authenticate" element={<AuthenticationRoute />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

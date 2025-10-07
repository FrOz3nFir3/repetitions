import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "../components/layout/Header/Header";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

// Lazy-loaded route wrappers
const LandingPageRoute = lazy(() =>
  import("../features/home/routes/LandingPageRoute")
);
const CategoryPageRoute = lazy(() =>
  import("../features/cards/routes/CategoryPageRoute")
);
const CardsPageRoute = lazy(() =>
  import("../features/cards/routes/CardsPageRoute")
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
const PublicPageRoute = lazy(() =>
  import("../features/profile/routes/PublicPageRoute")
);
const AuthenticationRoute = lazy(() =>
  import("../features/authentication/routes/AuthenticationRoute")
);
const NotFoundRoute = lazy(() =>
  import("../features/not-found/routes/NotFoundRoute")
);

// Root layout component
const RootLayout = () => (
  <ErrorBoundary>
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Header />
      <Outlet />
      <Toaster />
      <ScrollRestoration
        getKey={(location, matches) => {
          // probably look into this later
          if (
            location.search.includes("cardNo") ||
            location.search.includes("quizNo") ||
            location.search.includes("flashcardFilter") ||
            location.search.includes("search") ||
            location.pathname === "/categories" ||
            location.pathname.startsWith("/category")
          ) {
            return location.pathname;
          }
          return location.key;
        }}
      />
    </div>
  </ErrorBoundary>
);

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPageRoute />,
      },
      {
        path: "categories",
        element: <CategoryPageRoute />,
      },
      {
        path: "category/:name",
        element: <CardsPageRoute />,
      },
      {
        path: "card/:id/*",
        element: <IndividualCardPageRoute />,
      },
      {
        path: "progress",
        element: <ProgressPageRoute />,
      },
      {
        path: "profile",
        element: <ProfilePageRoute />,
      },
      {
        path: "profile/:username",
        element: <PublicPageRoute />,
      },
      {
        path: "authenticate",
        element: <AuthenticationRoute />,
      },
      {
        path: "*",
        element: <NotFoundRoute />,
      },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;

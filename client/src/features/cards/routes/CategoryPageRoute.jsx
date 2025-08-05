import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CategoryPageSkeleton from "../../../components/ui/skeletons/CategoryPageSkeleton";

const CategoryPage = lazy(() => import("./CategoryPage"));
const CardsList = lazy(() => import("../components/CardsList"));

const CategoryPageRoute = () => (
  <Suspense fallback={<CategoryPageSkeleton />}>
    <Routes>
      <Route path="/" element={<CategoryPage />}>
        <Route path=":name" element={<CardsList />} />
      </Route>
    </Routes>
  </Suspense>
);

export default CategoryPageRoute;

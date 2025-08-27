import React, { Suspense, lazy } from "react";
import CategoryPageSkeleton from "../../../components/ui/skeletons/CategoryPageSkeleton";

const CategoryPage = lazy(() => import("./CategoryPage"));

const CategoryPageRoute = () => (
  <Suspense fallback={<CategoryPageSkeleton />}>
    <CategoryPage />
  </Suspense>
);

export default CategoryPageRoute;

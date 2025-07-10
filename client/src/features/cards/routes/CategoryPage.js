import React, { useRef } from "react";
import { useGetAllCardsQuery } from "../../../api/apiSlice";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import CategorySkeleton from "../../../components/ui/skeletons/CategoryPageSkeleton";
import PreviouslyStudied from "../../progress/components/PreviouslyStudied";
import CreateCategoryCard from "../components/CreateCategoryCard";

function CategoryPage() {
  const categoryOutletRef = useRef(null);
  const navigate = useNavigate();
  const { name: categoryName } = useParams();

  const { data: allCards = [], isFetching: isFetchingAllCards } =
    useGetAllCardsQuery();

  const handleCategoryClick = (category) => {
    categoryOutletRef.current.scrollIntoView({ behavior: "smooth" });
    navigate(category);
  };

  const handleCreateCategory = (categoryName) => {
    categoryOutletRef.current.scrollIntoView({ behavior: "smooth" });
    navigate(categoryName);
  };

  if (isFetchingAllCards) {
    return <CategorySkeleton />;
  }

  const uniqueCategories = [...new Set(allCards)];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto !px-4 !py-8">
        <PreviouslyStudied />
        <div className="my-8">
          <h3 className="text-3xl font-semi text-gray-900 dark:text-white sm:text-4xl">
            Choose a Category
          </h3>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Select a category to start studying or create a new one to begin
            your learning journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {uniqueCategories.map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`relative rounded-xl self-start shadow-lg p-6 flex flex-col justify-between items-center text-center cursor-pointer transition-transform transform hover:scale-105 ${
                categoryName === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <h3 className="text-2xl font-bold dark:text-white">{category}</h3>
            </div>
          ))}

          <CreateCategoryCard onCreate={handleCreateCategory} />
        </div>
        <div ref={categoryOutletRef} className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;

import React, { useState } from "react";
import { useGetAllCardsQuery } from "../../api/apiSlice";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import CategorySkeleton from "../../components/skeletons/CategorySkeleton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import PreviouslyStudied from "./PreviouslyStudied";

function Category() {
  const categoryOutletRef = React.useRef(null);
  const navigate = useNavigate();
  const { name: categoryName } = useParams();

  const { data: allCards = [], isFetching: isFetchingAllCards } =
    useGetAllCardsQuery();

  const [newCategory, setNewCategory] = useState("");

  const handleCategoryClick = (category) => {
    categoryOutletRef.current.scrollIntoView({ behavior: "smooth" });
    navigate(category);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      categoryOutletRef.current.scrollIntoView({ behavior: "smooth" });
      navigate(newCategory.trim());
      setNewCategory("");
    }
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

          {/* Create New Category Card */}
          <div className="relative rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center bg-white dark:bg-gray-800">
            <PlusCircleIcon className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New
            </h3>
            <form onSubmit={handleCreateCategory} className="w-full">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="cursor-pointer mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
            </form>
          </div>
        </div>
        <div ref={categoryOutletRef} className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Category;

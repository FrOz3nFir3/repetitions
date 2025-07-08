import React, { useState } from "react";
import {
  useGetAllCardsQuery,
  usePostCardsByIdsMutation,
} from "../../api/apiSlice";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../authentication/authSlice";
import { CardsBySearch } from "../cards/Cards";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function Category() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { name: categoryName } = useParams();

  const { data: allCards = [], isFetching: isFetchingAllCards } =
    useGetAllCardsQuery();

  const cardsIds = user?.studying.map(({ card_id }) => card_id) || [];
  const [
    getCards,
    { data: studyingCards = [], isLoading: isLoadingStudyingCards },
  ] = usePostCardsByIdsMutation();

  React.useEffect(() => {
    if (user) {
      getCards({ cardsIds });
    }
  }, [user]);

  const [newCategory, setNewCategory] = useState("");

  const handleCategoryClick = (category) => {
    navigate(category);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      navigate(newCategory.trim());
      setNewCategory("");
    }
  };

  if (isFetchingAllCards) {
    return <Loading />;
  }

  const uniqueCategories = [...new Set(allCards)];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto !px-4 !py-8">
        <div className="my-8">
          <h1 className="text-3xl font-semi text-gray-900 sm:text-4xl">
            Choose a Category
          </h1>
          <p className="mt-8 text-lg text-gray-600">
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
                  : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-bold">{category}</h3>
            </div>
          ))}

          {/* Create New Category Card */}
          <div className="relative rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center bg-white">
            <PlusCircleIcon className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Create New
            </h3>
            <form onSubmit={handleCreateCategory} className="w-full">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

        <div className="mt-16">
          <Outlet />
        </div>

        {user && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Previously Studied Cards:
            </h3>
            {isLoadingStudyingCards ? (
              <Loading />
            ) : (
              <CardsBySearch cards={studyingCards} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;

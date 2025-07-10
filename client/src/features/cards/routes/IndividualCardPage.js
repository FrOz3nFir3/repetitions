import React, { useEffect } from "react";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";
import { initialCard, selectCurrentCard } from "../state/cardSlice";
import CardInfo from "../components/CardInfo";
import CardActions from "../components/CardActions";

function IndividualCardPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: cardData, isFetching } = useGetIndividualCardQuery(params.id);
  const card = useSelector(selectCurrentCard);

  useEffect(() => {
    if (cardData) {
      dispatch(initialCard(cardData));
    }
  }, [cardData, dispatch]);

  if (isFetching || !card) {
    return <IndividualCardPageSkeleton />;
  }

  const isDefaultView = location.pathname === `/card/${card._id}`;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            {card["main-topic"]}
          </h1>
          <p className="mt-2 text-2xl text-indigo-600 font-semibold">
            {card["sub-topic"]}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CardInfo card={card} />
            <CardActions />
          </div>

          <div className="lg:col-span-2">
            {isDefaultView ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Select an action
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose Review, Quiz, or Manage Flashcards to get started.
                </p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualCardPage;

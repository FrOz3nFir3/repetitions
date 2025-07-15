import React, { useEffect } from "react";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";
import { initialCard, selectCurrentCard } from "../state/cardSlice";
import CardInfo from "../components/CardInfo";
import CardActions from "../components/CardActions";
import CardLogs from "../components/CardLogs";

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

  const isDefaultView =
    location.pathname === `/card/${card._id}` ||
    location.pathname === `/card/${card._id}/`;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CardInfo card={card} />
            <CardLogs logs={card.logs || []} cardId={card._id} />
          </div>

          <div className="lg:col-span-2">
            {isDefaultView ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white ">
                  Select an action
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose Review, Quiz, or Manage Flashcards to get started.
                </p>
                <div className="mt-4 mx-auto">
                  <CardActions layout="horizontal" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Outlet />
                <CardActions showInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualCardPage;

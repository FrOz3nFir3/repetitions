import React, { useEffect } from "react";
import { useParams, Outlet, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";
import { initialCard, selectCurrentCard } from "../state/cardSlice";
import CardInfo from "../components/CardInfo";
import CardActions from "../components/CardActions";
import CardLogs from "../components/CardLogs";

import Breadcrumbs from "../components/Breadcrumbs";

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

  // Better naming: describes what we're checking for
  const isFocusedActivity =
    location.pathname === `/card/${card._id}/review` ||
    location.pathname === `/card/${card._id}/quiz`;

  const isDefaultView =
    location.pathname === `/card/${card._id}` ||
    location.pathname === `/card/${card._id}/`;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumbs card={card} cardData={cardData} />

        <div
          className={`grid grid-cols-1 ${
            isFocusedActivity ? "" : "lg:grid-cols-3"
          } gap-8`}
        >
          {!isFocusedActivity && (
            <div className="lg:col-span-1 space-y-6">
              <CardInfo card={card} />
              <CardLogs logs={card.logs || []} cardId={card._id} />
            </div>
          )}

          <div className={`${isFocusedActivity ? "" : "lg:col-span-2"}`}>
            {isDefaultView ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Ready to Learn?
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Choose your learning adventure and start mastering your
                    content!
                  </p>
                </div>
                <div className="mt-8">
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

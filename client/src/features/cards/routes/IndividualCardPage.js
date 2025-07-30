import React, { useEffect } from "react";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import { initialCard, selectCurrentCard } from "../state/cardSlice";
import CardInfo from "../components/CardInfo";
import CardLogs from "../components/CardLogs";
import Breadcrumbs from "../components/Breadcrumbs";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";

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

  const isFocusedActivity =
    location.pathname.includes("/review") ||
    location.pathname.includes("/quiz");

  if (isFetching || !card) {
    return <IndividualCardPageSkeleton isFocusedActivity={isFocusedActivity} />;
  }

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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualCardPage;

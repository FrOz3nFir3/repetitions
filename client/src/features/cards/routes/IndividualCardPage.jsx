import React, { useEffect } from "react";
import {
  useParams,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import { initialCard, selectCurrentCard } from "../state/cardSlice";
import CardInfo from "../components/CardInfo";
import CardLogs from "../components/CardLogs";
import Breadcrumbs from "../components/Breadcrumbs";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";

function IndividualCardPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const getCardViewType = () => {
    const { pathname, search } = location;
    if (pathname.includes("/review")) return "review";
    if (pathname.includes("/quiz")) return "quiz";

    if (pathname.includes("/edit")) {
      const view = searchParams.get("view");
      if (view === "flashcards") return "edit_flashcards";
      if (view === "quizzes") return "edit_quizzes";

      // default when in edit
      return "edit_flashcards";
    }
    return "overview"; // default view
  };

  const { data: cardData, isFetching } = useGetIndividualCardQuery({
    id: params.id,
    view: getCardViewType(),
  });
  const card = useSelector(selectCurrentCard);

  useEffect(() => {
    if (cardData) {
      dispatch(initialCard(cardData));
    }

    // sync up edit to flaschards
    const { pathname } = location;
    const view = searchParams.get("view");
    const inValidView = view !== "flashcards" && view !== "quizzes";
    if (pathname.includes("/edit") && inValidView) {
      searchParams.set("view", "flashcards");
      setSearchParams(searchParams);
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

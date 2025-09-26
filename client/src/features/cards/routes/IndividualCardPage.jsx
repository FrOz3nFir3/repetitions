import React, { lazy, useEffect } from "react";
import {
  useParams,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import { initialCard } from "../state/cardSlice";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import CardInfo from "../components/CardInfo";
import CardLogs from "../components/CardLogs";
import Breadcrumbs from "../components/Breadcrumbs";
import IndividualCardPageSkeleton from "../../../components/ui/skeletons/IndividualCardPageSkeleton";

const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

function IndividualCardPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const getCardViewType = () => {
    const { pathname } = location;
    if (pathname.includes("/edit")) {
      const view = searchParams.get("view");
      if (view === "flashcards") return "edit_flashcards";
      if (view === "quizzes") return "edit_quizzes";
      if (view === "review-queue") return "review-queue"; // Use review-queue view for optimized data

      // default when in edit
      return "edit_flashcards";
    }
    return "overview"; // default view
  };

  // Fetch card data (only for overview and edit routes that use outlet)
  const { data: cardData, isFetching } = useGetIndividualCardQuery({
    id: params.id,
    view: getCardViewType(),
  });

  useEffect(() => {
    if (cardData) {
      dispatch(initialCard(cardData));
    }

    // sync up edit to flashcards
    const { pathname } = location;
    const view = searchParams.get("view");
    const validViews = ["flashcards", "quizzes", "review-queue"];
    const inValidView = !validViews.includes(view);
    if (pathname.includes("/edit") && inValidView) {
      setSearchParams((prev) => {
        prev.set("view", "flashcards");
        return prev;
      });
    }
  }, [cardData, dispatch, location, searchParams, setSearchParams]);

  // Show loading while fetching data
  if (isFetching) {
    return (
      <IndividualCardPageSkeleton
        isFocusedActivity={false}
        view={getCardViewType()}
      />
    );
  }

  if (!cardData) {
    // probably move from here to individual components later
    return <NotFound />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumbs card={cardData} cardData={cardData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CardInfo card={cardData} />
            {/* TODO: position this better or have better visual  */}
            <CardLogs logs={cardData.logs || []} cardId={cardData._id} />
          </div>

          <div className="lg:col-span-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualCardPage;

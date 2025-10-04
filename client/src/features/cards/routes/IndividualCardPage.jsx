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

  const isEditRoute = location.pathname.includes("/edit");

  // For edit routes, fetch overview with skipLogs
  // For overview route, fetch with logs
  const { data: cardData, isFetching } = useGetIndividualCardQuery({
    id: params.id,
    view: "overview",
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
      <IndividualCardPageSkeleton isFocusedActivity={false} view="overview" />
    );
  }

  if (!cardData) {
    // probably move from here to individual components later
    return <NotFound />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto 2xl:max-w-7xl p-4">
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

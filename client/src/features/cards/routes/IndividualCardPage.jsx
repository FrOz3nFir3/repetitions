import React, { lazy, useEffect, useState } from "react";
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

function IndividualCardPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  // Sidebar collapse state - persisted in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("cardEditSidebarCollapsed");
    return saved === "true";
  });

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

  const toggleSidebar = (scrollToId = null) => {
    setIsSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("cardEditSidebarCollapsed", String(newValue));

      // If expanding and scrollToId provided, scroll to that section after animation
      if (prev && scrollToId) {
        setTimeout(() => {
          const element = document.getElementById(scrollToId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 350); // Wait for sidebar animation to complete
      }

      return newValue;
    });
  };

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

        {/* Mobile: Always show full layout (single column) */}
        <div className="lg:hidden grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <CardInfo card={cardData} />
            <CardLogs logs={cardData.logs || []} cardId={cardData._id} />
          </div>
          <div>
            <Outlet />
          </div>
        </div>

        {/* Desktop: Collapsible sidebar layout */}
        <div className="hidden lg:block">
          {isEditRoute && isSidebarCollapsed ? (
            /* Collapsed Layout - Flexbox with fixed sidebar (Desktop only) */
            <div className="flex gap-4">
              {/* Collapsed Sidebar - Icon Only */}
              <div className="w-16 flex-shrink-0">
                <div className="sticky top-4 space-y-4">
                  <button
                    onClick={() => toggleSidebar()}
                    className="cursor-pointer w-full p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
                    title="Expand sidebar"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-all mx-auto" />
                  </button>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => toggleSidebar("card-info-section")}
                      className="cursor-pointer w-full p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg border-2 border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
                      title="Card Info - Click to expand"
                    >
                      <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:scale-110 transition-all mx-auto" />
                    </button>

                    <button
                      onClick={() => toggleSidebar("card-logs-section")}
                      className="cursor-pointer w-full p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg border-2 border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
                      title="Card Logs - Click to expand"
                    >
                      <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:scale-110 transition-all mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content - Full Width */}
              <div className="flex-1 min-w-0">
                <Outlet />
              </div>
            </div>
          ) : (
            /* Expanded Layout - Grid with sidebar (Desktop only) */
            <div className="grid grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="col-span-1 space-y-6">
                {isEditRoute && (
                  <button
                    onClick={() => toggleSidebar()}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg active:scale-95 transition-all duration-200 group"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-1 transition-all" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Collapse Sidebar
                    </span>
                  </button>
                )}
                <div id="card-info-section">
                  <CardInfo card={cardData} />
                </div>
                <div id="card-logs-section">
                  <CardLogs logs={cardData.logs || []} cardId={cardData._id} />
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-2">
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndividualCardPage;

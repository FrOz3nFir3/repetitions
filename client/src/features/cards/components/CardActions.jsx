import React from "react";
import {
  BookOpenIcon,
  PencilSquareIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import {
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid,
  PencilSquareIcon as PencilSquareSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverSolid,
  LightBulbIcon,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckSolid,
} from "@heroicons/react/24/solid";
import ActionCard from "./ActionCard";
import { useSelector } from "react-redux";
import { selectCurrentCard } from "../state/cardSlice";

const CardActions = ({
  layout = "vertical",
  showInfo = false,
  isRelative = false,
}) => {
  const card = useSelector(selectCurrentCard);
  const containerClasses = {
    vertical: "grid grid-cols-1 sm:grid-cols-2 gap-8",
    horizontal: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  };

  const reviewLength = card?.review?.length || card?.reviewLength || 0;
  const quizzesLength = card?.quizzes?.length || card?.quizzesLength || 0;
  const reviewQueueLength =
    card?.reviewQueue?.length || card?.reviewQueueLength || 0;

  // Create relative paths that navigate to sibling routes
  const getActionPath = (action) => (isRelative ? action : `../${action}`);

  return (
    <div className="space-y-8">
      {showInfo && (
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <LightBulbIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-white">
                Time to Learn Something Amazing!
              </p>
              <p className="text-sm text-white/90">
                Choose your path: Review, Quiz, or Edit your content
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={containerClasses[layout]}>
        <ActionCard
          to={getActionPath("review")}
          icon={BookOpenIcon}
          solidIcon={BookOpenSolid}
          title="Review"
          subtitle="📚 Study Mode"
          description="Master your flashcards with smart spaced repetition"
          bgGradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
          hoverGradient="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30"
          color="blue"
          layout={layout}
          stats={[
            {
              value: reviewLength,
              label: "Flashcards",
              icon: BookOpenSolid,
            },
          ]}
        />

        <ActionCard
          to={getActionPath("quiz")}
          icon={AcademicCapIcon}
          solidIcon={AcademicCapSolid}
          title="Quiz"
          subtitle="🎯 Challenge Mode"
          description="Test your knowledge with interactive questions"
          bgGradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600"
          hoverGradient="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30"
          color="purple"
          layout={layout}
          stats={[
            {
              value: quizzesLength,
              label: "Quizzes",
              icon: AcademicCapSolid,
            },
          ]}
        />

        <ActionCard
          to={getActionPath("edit?view=review-queue")}
          icon={ClipboardDocumentCheckIcon}
          solidIcon={ClipboardDocumentCheckSolid}
          title="Review Queue"
          subtitle="📝 Collaboration Mode"
          description="Review and approve changes from other users."
          bgGradient="bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700"
          hoverGradient="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/30"
          color="gray"
          layout={layout}
          className={layout === "vertical" ? "sm:col-span-2" : "lg:col-span-2"}
          stats={[
            {
              value: reviewQueueLength,
              label: "Pending",
              icon: ClipboardDocumentCheckSolid,
            },
          ]}
        />

        <ActionCard
          to={getActionPath("edit?view=flashcards")}
          icon={PencilSquareIcon}
          solidIcon={PencilSquareSolid}
          title="Edit Flashcards"
          subtitle="✏️ Create Mode"
          description="Build and organize your flashcard collection"
          bgGradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
          hoverGradient="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30"
          color="emerald"
          layout={layout}
        />

        <ActionCard
          to={getActionPath("edit?view=quizzes")}
          icon={WrenchScrewdriverIcon}
          solidIcon={WrenchScrewdriverSolid}
          title="Edit Quizzes"
          subtitle="✏️ Create Mode"
          description="Create and customize your quiz questions"
          bgGradient="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600"
          hoverGradient="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30"
          color="amber"
          layout={layout}
        />
      </div>
    </div>
  );
};

export default CardActions;

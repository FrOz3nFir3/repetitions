import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  BookOpenIcon,
  PencilSquareIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid,
  PencilSquareIcon as PencilSquareSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverSolid,
  LightBulbIcon,
} from "@heroicons/react/24/solid";

export const ActionCard = ({
  to,
  icon: Icon,
  solidIcon: SolidIcon,
  title,
  subtitle,
  description,
  bgGradient,
  hoverGradient,
  layout = "vertical",
  stats,
  color,
  scrollToTop = false,
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const isActive =
    location.pathname.includes(to) ||
    (to.startsWith("edit") && to.includes(view));

  const handleClick = () => {
    if (scrollToTop) {
      // Small delay to ensure navigation happens first
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  if (layout === "horizontal") {
    return (
      <Link to={to} onClick={handleClick} className="group block">
        <div
          className={`
          relative overflow-hidden rounded-2xl p-6 h-full
          transition-all duration-500 ease-out
          transform hover:scale-[1.02] hover:-translate-y-1
          ${
            isActive
              ? `${bgGradient} shadow-2xl ring-2 ring-white/50`
              : `bg-white dark:bg-gray-800 hover:${hoverGradient} shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700`
          }
        `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-12 -translate-x-12" />
          </div>

          <div className="relative z-10 flex items-start gap-4 h-full">
            {/* Icon */}
            <div
              className={`
              flex-shrink-0 p-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 backdrop-blur-sm"
                  : `bg-${color}-100 dark:bg-${color}-900/30 group-hover:bg-white group-hover:shadow-lg`
              }
            `}
            >
              {isActive ? (
                <SolidIcon
                  className={`w-7 h-7 ${
                    isActive
                      ? "text-white"
                      : `text-${color}-600 dark:text-${color}-400`
                  }`}
                />
              ) : (
                <Icon
                  className={`w-7 h-7 text-${color}-600 dark:text-${color}-400 group-hover:text-${color}-700`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-center items-center gap-2 mb-1">
                <h3
                  className={`
                  font-bold text-lg leading-tight
                  ${isActive ? "text-white" : "text-gray-900 dark:text-white"}
                `}
                >
                  {title}
                </h3>
                {isActive && <StarIcon className="w-4 h-4 text-yellow-300" />}
              </div>

              <p
                className={`
                text-sm font-medium mb-2
                ${
                  isActive
                    ? "text-white/80"
                    : `text-${color}-600 dark:text-${color}-400`
                }
              `}
              >
                {subtitle}
              </p>

              <p
                className={`
                text-sm leading-relaxed
                ${
                  isActive
                    ? "text-white/70"
                    : "text-gray-600 dark:text-gray-400"
                }
              `}
              >
                {description}
              </p>

              {/* Stats */}
              {stats && (
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/20">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <stat.icon
                        className={`w-4 h-4 ${
                          isActive ? "text-white/60" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-white/80"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </Link>
    );
  }

  // Vertical layout - Big, Bold, Beautiful
  return (
    <Link to={to} onClick={handleClick} className="group block">
      <div
        className={`
        relative overflow-hidden rounded-3xl p-8 text-center h-full min-h-[280px]
        transition-all duration-500 ease-out
        transform hover:scale-105 hover:-translate-y-2
        ${
          isActive
            ? `${bgGradient} shadow-2xl ring-4 ring-white/30`
            : `bg-white dark:bg-gray-800 hover:${hoverGradient} shadow-xl hover:shadow-2xl border-2 border-gray-100 dark:border-gray-700`
        }
      `}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/30 -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/20 translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white/10 -translate-x-12 -translate-y-12 group-hover:rotate-45 transition-transform duration-1000" />
        </div>

        <div className="relative z-10 flex flex-col items-center h-full">
          {/* Icon */}
          <div
            className={`
            relative p-6 rounded-2xl mb-6 transition-all duration-500
            ${
              isActive
                ? "bg-white/20 backdrop-blur-sm shadow-lg"
                : `bg-${color}-100 dark:bg-${color}-900/30 group-hover:bg-white group-hover:shadow-xl group-hover:scale-110`
            }
          `}
          >
            {isActive ? (
              <SolidIcon className="w-12 h-12 text-white" />
            ) : (
              <Icon
                className={`w-12 h-12 text-${color}-600 dark:text-${color}-400 group-hover:text-${color}-700`}
              />
            )}

            {/* Icon Glow Effect */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3
                className={`
                font-bold text-2xl
                ${isActive ? "text-white" : "text-gray-900 dark:text-white"}
              `}
              >
                {title}
              </h3>
              {isActive && (
                <FireIcon className="w-6 h-6 text-yellow-300 animate-bounce" />
              )}
            </div>

            <p
              className={`
              text-base font-semibold mb-3
              ${
                isActive
                  ? "text-white/90"
                  : `text-${color}-600 dark:text-${color}-400`
              }
            `}
            >
              {subtitle}
            </p>

            <p
              className={`
              text-sm leading-relaxed max-w-xs mx-auto
              ${isActive ? "text-white/80" : "text-gray-600 dark:text-gray-400"}
            `}
            >
              {description}
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white/70" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isActive
                        ? "text-white/90"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Magical Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sparkle Effect for Active State */}
        {isActive && (
          <div className="absolute top-4 right-4">
            <SparklesIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
        )}
      </div>
    </Link>
  );
};

const CardActions = ({ layout = "vertical", showInfo = false }) => {
  const containerClasses = {
    vertical: "grid grid-cols-1 sm:grid-cols-2 gap-8",
    horizontal: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  };

  // Remove stats since we don't have real data yet - cleaner look!
  const getActionStats = () => {
    return null; // No stats for now - keeps it clean and focused
  };

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
          to="review"
          icon={BookOpenIcon}
          solidIcon={BookOpenSolid}
          title="Review"
          subtitle="📚 Study Mode"
          description="Master your flashcards with smart spaced repetition"
          bgGradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
          hoverGradient="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30"
          color="blue"
          layout={layout}
          stats={getActionStats()}
          scrollToTop={true}
        />

        <ActionCard
          to="quiz"
          icon={AcademicCapIcon}
          solidIcon={AcademicCapSolid}
          title="Quiz"
          subtitle="🎯 Challenge Mode"
          description="Test your knowledge with interactive questions"
          bgGradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600"
          hoverGradient="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30"
          color="purple"
          layout={layout}
          stats={getActionStats()}
          scrollToTop={true}
        />

        <ActionCard
          to="edit?view=flashcards"
          icon={PencilSquareIcon}
          solidIcon={PencilSquareSolid}
          title="Edit Flashcards"
          subtitle="✏️ Create Mode"
          description="Build and organize your flashcard collection"
          bgGradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
          hoverGradient="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30"
          color="emerald"
          layout={layout}
          stats={getActionStats()}
          scrollToTop={true}
        />

        <ActionCard
          to="edit?view=quizzes"
          icon={WrenchScrewdriverIcon}
          solidIcon={WrenchScrewdriverSolid}
          title="Edit Quizzes"
          subtitle="✏️ Create Mode"
          description="Create and customize your quiz questions"
          bgGradient="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600"
          hoverGradient="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30"
          color="amber"
          layout={layout}
          stats={getActionStats()}
          scrollToTop={true}
        />
      </div>
    </div>
  );
};

export default CardActions;

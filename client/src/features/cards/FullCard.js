import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { selectCurrentCard } from "./cardSlice";
import { CardField } from "./CardField";
import {
  BookOpenIcon,
  PencilSquareIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

function FullCard() {
  const card = useSelector(selectCurrentCard);
  const location = useLocation();

  if (!card) {
    return null; // Or a loading state
  }

  const {
    _id,
    "main-topic": mainTopic,
    "sub-topic": subTopic,
    description = "",
    category,
  } = card;

  const isDefaultView = location.pathname === `/card/${_id}`;

  const getLinkClass = (path, baseBg, hoverBg) => {
    const isActive = location.pathname.includes(path);
    if (isActive) {
      return `w-full text-center rounded-lg px-5 py-3 text-lg font-semibold shadow-sm flex items-center justify-center transition-colors duration-200 bg-gray-200 text-indigo-600`;
    }
    return `w-full text-center rounded-lg px-5 py-3 text-lg font-semibold text-white shadow-sm flex items-center justify-center transition-colors duration-200 ${baseBg} ${hoverBg}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            {mainTopic}
          </h1>
          <p className="mt-2 text-2xl text-indigo-600 font-semibold">
            {subTopic}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Card Details & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Card Details
              </h2>
              <CardField _id={_id} text="main-topic" value={mainTopic} />
              <CardField _id={_id} text="sub-topic" value={subTopic} />
              <CardField _id={_id} text="category" value={category} />
              <CardField _id={_id} text="description" value={description} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col space-y-4">
              <Link
                to="review"
                className={getLinkClass(
                  "review",
                  "bg-indigo-600",
                  "hover:bg-indigo-700"
                )}
              >
                <BookOpenIcon className="h-6 w-6 mr-2" />
                Review
              </Link>
              <Link
                to="quiz"
                className={getLinkClass(
                  "quiz",
                  "bg-purple-600",
                  "hover:bg-purple-700"
                )}
              >
                <PencilSquareIcon className="h-6 w-6 mr-2" />
                Quiz
              </Link>
              <Link
                to="edit"
                className={getLinkClass(
                  "edit",
                  "bg-gray-600",
                  "hover:bg-gray-700"
                )}
              >
                <CogIcon className="h-6 w-6 mr-2" />
                Manage Flashcards
              </Link>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2">
            {isDefaultView ? (
              <div className="text-center py-10 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-900">
                  Select an action
                </h3>
                <p className="mt-1 text-sm text-gray-500">
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

export default FullCard;



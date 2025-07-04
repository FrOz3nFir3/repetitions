import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../authentication/authSlice";
import { Link } from "react-router-dom";
import { usePostCardsByIdsMutation } from "../../api/apiSlice";
import Loading from "../../components/common/Loading";
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

function Profile() {
  const user = useSelector(selectCurrentUser);
  const cardsIds = user?.studying.map(({ card_id }) => card_id) || [];
  const [getCards, { data: cardDetails = [], isLoading }] =
    usePostCardsByIdsMutation();

  React.useEffect(() => {
    if (user) {
      getCards({ cardsIds });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center py-12 px-4">
        <div className="max-w-lg w-full bg-white p-10 rounded-xl shadow-lg">
          <LockClosedIcon className="h-12 w-12 mx-auto text-indigo-500" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Access Restricted
          </h2>
          <p className="mt-2 text-gray-600">
            You need to be logged in to view your profile and track your
            progress.
          </p>
          <div className="mt-8">
            <Link
              to="/authenticate"
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Login or Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || cardDetails.length !== cardsIds.length) {
    return <Loading />;
  }

  // Calculate overall stats
  const totalDecksStudied = user.studying.length;
  const totalQuizzesTaken = user.studying.reduce(
    (acc, deck) => acc + (deck["times-started"] || 0),
    0
  );
  const totalCorrect = user.studying.reduce(
    (acc, deck) => acc + (deck["total-correct"] || 0),
    0
  );
  const totalIncorrect = user.studying.reduce(
    (acc, deck) => acc + (deck["total-incorrect"] || 0),
    0
  );
  const totalAnswers = totalCorrect + totalIncorrect;
  const overallAccuracy =
    totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  const stats = [
    { name: "Decks Studied", stat: totalDecksStudied, icon: BookOpenIcon },
    {
      name: "Quizzes Taken",
      stat: totalQuizzesTaken,
      icon: QuestionMarkCircleIcon,
    },
    {
      name: "Overall Accuracy",
      stat: `${overallAccuracy}%`,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 !py-12">
        <header className="my-10">
          <h1 className="!mb-4 text-4xl font-extrabold text-gray-900">
            Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">{user.email}</span>!
            Here's a look at your progress.
          </p>
        </header>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {stats.map((item) => (
            <div
              key={item.name}
              className="bg-white overflow-hidden shadow-lg rounded-lg p-6 flex items-center"
            >
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {item.stat}
                  </dd>
                </dl>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Deck Progress */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 !mb-4">Your Decks</h2>
          {totalDecksStudied > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {user.studying.map((progress, index) => {
                const details = cardDetails[index];
                if (!details) return null;

                const correct = progress["total-correct"] || 0;
                const incorrect = progress["total-incorrect"] || 0;
                const total = correct + incorrect;
                const accuracy =
                  total > 0 ? Math.round((correct / total) * 100) : 0;

                return (
                  <div
                    key={progress.card_id}
                    className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-grow">
                      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                        {details.category}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-gray-900 truncate">
                        {details["main-topic"]}
                      </h3>
                      <p className="text-md text-gray-700 truncate">
                        {details["sub-topic"]}
                      </p>

                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Accuracy
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {accuracy}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-500">Correct</p>
                          <p className="text-lg font-bold text-green-600">
                            {correct}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Incorrect</p>
                          <p className="text-lg font-bold text-red-600">
                            {incorrect}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Finished</p>
                          <p className="text-lg font-bold text-gray-800">
                            {progress["times-finished"] || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4">
                      <Link
                        to={`/card/${progress.card_id}`}
                        className="w-full text-center block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                      >
                        Continue Studying
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-900">
                You haven't studied any decks yet.
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Once you start a quiz, your progress will appear here.
              </p>
              <Link
                to="/category"
                className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Find a Deck to Study
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

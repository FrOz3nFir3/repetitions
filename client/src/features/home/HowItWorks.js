import {
  ArrowPathIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const HowItWorks = (props) => {
  const howItWorksRef = props.ref;

  return (
    <section
      ref={howItWorksRef}
      className="bg-white dark:bg-gray-800 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Our Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Master Knowledge in 3 Easy Steps
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gray-400 dark:bg-gray-600"></div>
          <div className="space-y-16">
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  1. Create
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Start by creating your own flashcard decks. Add questions,
                  answers, and any other information you need to learn.
                </p>
              </div>
              <div className="w-1/2 pl-8">
                <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <PencilSquareIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8">
                <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <ArrowPathIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="w-1/2 pl-8 text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  2. Review
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Our intelligent system will notify you at the optimal time to
                  review each card, ensuring maximum retention.
                </p>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  3. Quiz
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Test your knowledge with our interactive quizzes and track
                  your performance to see how much you've learned.
                </p>
              </div>
              <div className="w-1/2 pl-8">
                <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <CheckCircleIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;

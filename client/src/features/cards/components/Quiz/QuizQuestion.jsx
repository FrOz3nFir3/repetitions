import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const QuizQuestion = ({ questionText, current }) => {
  return (
    <div className="relative mb-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-purple-200/50 dark:border-purple-700/50 shadow-2xl py-4 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">
              Question {current}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select from options below
            </p>
          </div>
        </div>

        {/* Question Content */}
        <div className="text-lg sm:text-xl text-gray-900 dark:text-white leading-relaxed">
          <HtmlRenderer htmlContent={questionText} />
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;

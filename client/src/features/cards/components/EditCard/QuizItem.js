import React from "react";
import {
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ListBulletIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const QuizItem = ({ quiz }) => {
  if (!quiz) return null;

  const { quizQuestion, quizAnswer, options, minimumOptions } = quiz;

  // Combine incorrect options with the correct answer
  const otherOptions = (options || []).filter(
    (opt) => opt.value !== quizAnswer
  );
  const correctAnswerOption = { value: quizAnswer, isCorrect: true };

  // The final list of options with the correct answer always first
  const finalOptions = [correctAnswerOption, ...otherOptions];

  return (
    <div className="space-y-8">
      {/* Question Section */}
      <div className="group space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Question
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              What will be asked in the quiz
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <HtmlRenderer htmlContent={quizQuestion} />
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="group space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
            <LightBulbIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <label className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Correct Answer
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The right answer to the question
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <HtmlRenderer htmlContent={quizAnswer} />
          </div>
        </div>
      </div>

      {/* Minimum Options Section */}
      <div className="group space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            <HashtagIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <label className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Minimum Options
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Required number of answer choices
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-amber-200 dark:border-amber-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {minimumOptions || 2}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              options minimum
            </span>
          </div>
        </div>
      </div>

      {/* Options Section */}
      <div className="group space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <ListBulletIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <label className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Answer Options
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All possible choices ({finalOptions.length} total)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {finalOptions.map((option, index) => {
            const isCorrect = option.value === quizAnswer;
            return (
              <div
                key={index}
                className={`relative p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                  isCorrect
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-500/30"
                    : "bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  {isCorrect && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    {isCorrect && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                          Correct Answer
                        </span>
                      </div>
                    )}
                    <div
                      className={`prose prose-sm dark:prose-invert max-w-none ${
                        isCorrect
                          ? "text-green-800 dark:text-green-200"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <HtmlRenderer
                        className="!mt-0"
                        htmlContent={option.value}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizItem;

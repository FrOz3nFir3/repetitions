import React from "react";
import PropTypes from "prop-types";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const Quiz = ({ quiz }) => {
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
    <div className="space-y-6">
      {/* Question Section */}
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          QUESTION
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <HtmlRenderer htmlContent={quizQuestion} />
        </div>
      </div>

      {/* Answer Section */}
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          ANSWER
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <HtmlRenderer htmlContent={quizAnswer} />
        </div>
      </div>

      {/* Minimum Options Section */}
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          MINIMUM OPTIONS
        </p>
        <p className="text-gray-800 dark:text-gray-200">
          {minimumOptions || 2}
        </p>
      </div>

      {/* Options Section */}
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          OPTIONS ({finalOptions.length})
        </p>
        <ul className="space-y-3">
          {finalOptions.map((option, index) => {
            const isCorrect = option.value === quizAnswer;
            return (
              <li
                key={index}
                className={`flex items-center p-4 rounded-lg border ${
                  isCorrect
                    ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-500/30"
                    : "bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
                }`}
              >
                {isCorrect && (
                  <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                )}
                <div
                  className={`prose prose-sm dark:prose-invert max-w-none ${
                    isCorrect
                      ? "text-green-800 dark:text-green-200"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <HtmlRenderer className="!mt-0" htmlContent={option.value} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

Quiz.propTypes = {
  quiz: PropTypes.shape({
    quizQuestion: PropTypes.string.isRequired,
    quizAnswer: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
    minimumOptions: PropTypes.number,
  }).isRequired,
};

export default Quiz;

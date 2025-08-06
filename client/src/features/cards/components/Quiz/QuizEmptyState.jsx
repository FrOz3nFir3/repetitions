import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const QuizEmptyState = () => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div className="relative z-10 text-center py-16 px-8">
      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg inline-block mb-6">
        <SparklesIcon className="h-12 w-12 text-white" />
      </div>
      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent mb-4">
        No Quiz Questions Available
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Add some quizzes from the edit page to start your learning journey.
      </p>
    </div>
  </div>
);

export default QuizEmptyState;

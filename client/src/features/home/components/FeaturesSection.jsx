import React from "react";
import {
  PencilSquareIcon,
  SparklesIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { GiftIcon } from "@heroicons/react/24/solid";

const FeaturesSection = () => {
  const features = [
    {
      name: "Simple Flashcard Creation",
      description:
        "Create and organize your flashcards with our clean, intuitive editor. Focus on your content without distractions.",
      icon: PencilSquareIcon,
      gradient: "from-blue-500 to-cyan-500",
      stats: "Easy to use",
    },
    {
      name: "Spaced Repetition System",
      description:
        "Review your flashcards using proven spaced repetition techniques to improve long-term memory retention.",
      icon: SparklesIcon,
      gradient: "from-purple-500 to-pink-500",
      stats: "Proven method",
    },
    {
      name: "Progress Tracking",
      description:
        "Monitor your learning progress with simple statistics and track which cards need more attention.",
      icon: ChartBarIcon,
      gradient: "from-emerald-500 to-teal-500",
      stats: "Stay motivated",
    },
    {
      name: "Open Source & Free",
      description:
        "Completely free to use with full source code available on GitHub. No restrictions - use it however you want.",
      icon: GiftIcon,
      gradient: "from-orange-500 to-red-500",
      stats: "Unlicense",
    },
  ];

  return (
    <div className="relative py-24 sm:py-32 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-indigo-900"></div>
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white dark:bg-gray-800 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:ring-gray-700 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-800 dark:text-indigo-200">
              <StarIcon className="w-4 h-4 mr-2" />
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Master Any Subject
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            A simple, effective flashcard application built with modern web
            technologies and available for everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden ${
                index % 2 === 0 ? "lg:translate-y-8" : ""
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>
              <div
                className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

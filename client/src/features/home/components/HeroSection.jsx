import React from "react";
import { Link } from "react-router-dom";
import { RocketLaunchIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const HeroSection = ({ onLearnMoreClick }) => {
  const flashcards = [
    {
      question: "What is the Pythagorean theorem?",
      answer: "a² + b² = c²",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      question: "What does 'ubiquitous' mean?",
      answer: "Present everywhere",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      question: "Define 'serendipity'",
      answer: "Pleasant surprise",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      question: "What is photosynthesis?",
      answer: "Plants making food from sunlight",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [flashcards.length]);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-indigo-300 dark:from-purple-800 dark:to-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-30 animate-pulse">
          <div className="absolute inset-4 bg-gradient-to-br from-purple-300 to-indigo-400 dark:from-purple-700 dark:to-indigo-600 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-10 w-48 h-48 bg-gradient-to-br from-blue-200 to-cyan-300 dark:from-blue-800 dark:to-cyan-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-30 animate-pulse animation-delay-2000">
          <div className="absolute inset-3 bg-gradient-to-br from-blue-300 to-cyan-400 dark:from-blue-700 dark:to-cyan-600 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-30 animate-pulse animation-delay-4000">
          <div className="absolute inset-4 bg-gradient-to-br from-emerald-300 to-teal-400 dark:from-emerald-700 dark:to-teal-600 rounded-full opacity-60"></div>
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 lg:py-20">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left animate-slide-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Learn Smarter,
              </span>
              <span className="pb-4 block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Remember Longer
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform your learning with spaced repetition flashcards and
              organized study sessions.
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {" "}
                Open source and completely free.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/category"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Start Learning Free
                </span>
              </Link>
              <button
                onClick={onLearnMoreClick}
                className="cursor-pointer inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <LightBulbIcon className="w-5 h-5 mr-2" />
                See How It Works
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-16 lg:mt-0 flex items-center justify-center px-4">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96 lg:h-[500px]">
              {flashcards.map((card, index) => {
                const isActive = index === currentCardIndex;
                const isNext =
                  index === (currentCardIndex + 1) % flashcards.length;
                const isPrev =
                  index ===
                  (currentCardIndex - 1 + flashcards.length) %
                    flashcards.length;

                return (
                  <div
                    key={index}
                    className={`absolute w-72 sm:w-80 h-44 sm:h-48 rounded-2xl shadow-2xl transition-all duration-700 transform cursor-pointer ${
                      isActive
                        ? "z-30 scale-100 rotate-0 translate-x-0 translate-y-0 opacity-100"
                        : isNext
                        ? "z-20 scale-95 rotate-2 translate-x-4 sm:translate-x-6 translate-y-3 opacity-80"
                        : isPrev
                        ? "z-20 scale-95 -rotate-2 -translate-x-4 sm:-translate-x-6 translate-y-3 opacity-80"
                        : "z-10 scale-90 rotate-3 translate-x-6 sm:translate-x-8 translate-y-6 opacity-60"
                    }`}
                    style={{
                      top: `${5 + index * 8}%`,
                      left: `80%`,
                      transform: `translateX(-50%) ${
                        isActive
                          ? "translateY(0) rotate(0deg) scale(1)"
                          : isNext
                          ? "translateY(12px) translateX(-40%) rotate(2deg) scale(0.95)"
                          : isPrev
                          ? "translateY(12px) translateX(-60%) rotate(-2deg) scale(0.95)"
                          : "translateY(24px) translateX(-30%) rotate(3deg) scale(0.9)"
                      }`,
                    }}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-2xl p-4 sm:p-6 text-white shadow-xl border border-white/20`}
                    >
                      <div className="flex flex-col justify-center h-full">
                        <div className="text-xs sm:text-sm font-medium opacity-80 mb-1 sm:mb-2">
                          Question
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold leading-tight mb-2 sm:mb-4">
                          {card.question}
                        </h3>
                        <div className="text-xs sm:text-sm font-medium opacity-80 mb-1">
                          Answer
                        </div>
                        <p className="text-sm sm:text-base font-semibold">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  PencilSquareIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { GifIcon, GiftIcon } from "@heroicons/react/24/solid";

const CtaSection = React.lazy(() => import("../components/CtaSection"));
const HowItWorks = React.lazy(() => import("../components/HowItWorks"));

const LandingPage = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  const howItWorksRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLearnMoreClick = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 text-slate-800 dark:text-slate-200 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Learning-themed Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Brain/Learning themed shapes */}
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
            {/* Left Content */}
            <div
              className={`lg:w-1/2 lg:pr-12 text-center lg:text-left transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
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

              {/* CTA Buttons */}
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
                  onClick={handleLearnMoreClick}
                  className="cursor-pointer inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <LightBulbIcon className="w-5 h-5 mr-2" />
                  See How It Works
                </button>
              </div>
            </div>

            {/* Right Content - Enhanced Flashcards */}
            <div className="lg:w-1/2 mt-16 lg:mt-0 flex items-center justify-center px-4">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96 lg:h-[500px]">
                {/* Animated Background Cards */}
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

      {/* Enhanced Features Section */}
      <div className="relative py-24 sm:py-32 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Background Pattern */}
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
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
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

      {/* How It Works Section */}
      <HowItWorks ref={howItWorksRef} />

      <CtaSection />
    </div>
  );
};

export default LandingPage;

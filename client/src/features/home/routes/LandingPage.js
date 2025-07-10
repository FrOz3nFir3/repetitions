import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  PencilSquareIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const CtaSection = React.lazy(() => import("../components/CtaSection"));
const HowItWorks = React.lazy(() => import("../components/HowItWorks"));

const LandingPage = () => {
  const features = [
    {
      name: "Create Flashcards with Ease",
      description:
        "Effortlessly create and organize your flashcards for any subject. Customize them with text and more.",
      icon: PencilSquareIcon,
    },
    {
      name: "Spaced Repetition Learning",
      description:
        "Our smart algorithm schedules reviews at optimal intervals to maximize long-term memory retention.",
      icon: SparklesIcon,
    },
    {
      name: "Engaging & Interactive Quizzes",
      description:
        "Test your knowledge with dynamic quizzes that adapt to your learning progress and keep you motivated.",
      icon: AcademicCapIcon,
    },
    {
      name: "Track Your Progress Intuitively",
      description:
        "Visualize your learning journey, monitor your strengths, and pinpoint areas for improvement with our dashboard.",
      icon: ClockIcon,
    },
  ];

  const howItWorksRef = useRef(null);

  const handleLearnMoreClick = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-white dark:bg-gray-800 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Learn Smarter,</span>
                  <span className="block text-indigo-600">Remember Longer</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  The intelligent flashcard app designed to help you conquer any
                  subject. Stop cramming, start learning effectively.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/category"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={handleLearnMoreClick}
                      className="cursor-pointer flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 dark:bg-indigo-500 px-8 py-3 text-base font-medium text-indigo-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-indigo-600 md:py-4 md:px-10 md:text-lg"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8 lg:pt-0">
          <div className="relative w-full h-96 max-w-lg sm:h-72 md:h-96">
            <div className="absolute top-0 left-1/4 w-64 h-40  bg-indigo-500 text-white rounded-lg shadow-lg transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  What is the Pythagorean theorem?
                </h3>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/2 w-64 h-40  bg-green-500 text-white rounded-lg shadow-lg transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">a² + b² = c²</h3>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/4 w-64 h-40  bg-indigo-500 text-white rounded-lg shadow-lg transform -rotate-2 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  What does "ubiquitous" mean?
                </h3>
              </div>
            </div>
            <div className="absolute top-3/4 left-1/2 w-64 h-40  bg-green-500 text-white rounded-lg shadow-lg transform rotate-5 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  Present, appearing, or found everywhere.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* hero section with white flash card background  */}
      {/* <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Learn Smarter,</span>
                  <span className="block text-indigo-600">Remember Longer</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  The intelligent flashcard app designed to help you conquer any
                  subject. Stop cramming, start learning effectively.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/category"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={handleLearnMoreClick}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:py-4 md:px-10 md:text-lg"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
          <div className="relative w-full h-full max-w-lg">
            <div className="absolute top-0 left-1/4 w-72 h-48 bg-white rounded-lg shadow-lg transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">What is 5 x 8?</h3>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/2 w-72 h-48 bg-indigo-500 text-white rounded-lg shadow-lg transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">40</h3>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/4 w-72 h-48 bg-white rounded-lg shadow-lg transform -rotate-2 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">Define 'ephemeral'</h3>
              </div>
            </div>
            <div className="absolute top-3/4 left-1/2 w-72 h-48 bg-indigo-500 text-white rounded-lg shadow-lg transform rotate-5 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  Lasting for a very short time.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Feature Section */}
      <div className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Why Choose Us?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A Better Way to Learn
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our platform is engineered with proven learning methodologies to
              help you achieve your academic and professional aspirations.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2"
              >
                <feature.icon
                  className="h-12 w-12 text-indigo-600"
                  aria-hidden="true"
                />
                <h3 className="mt-6 text-xl font-semibold leading-8 text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
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

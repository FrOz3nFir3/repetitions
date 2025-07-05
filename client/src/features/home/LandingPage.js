import React from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const features = [
    {
      name: "Create Flashcards",
      description:
        "Easily create and manage your own sets of flashcards for any subject. Add text, images, and more.",
      icon: PencilSquareIcon,
    },
    {
      name: "Smart Spaced Repetition",
      description:
        "Our algorithm schedules reviews at the perfect time to maximize long-term retention.",
      icon: SparklesIcon,
    },
    {
      name: "Interactive Quizzes",
      description:
        "Test your knowledge with engaging quizzes that adapt to your learning progress.",
      icon: AcademicCapIcon,
    },
    {
      name: "Track Your Progress",
      description:
        "Visualize your learning journey, see your strengths, and identify areas for improvement.",
      icon: ClockIcon,
    },
  ];

  return (
    <div className="bg-white text-slate-800">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
            Master Anything with Spaced Repetition
          </h1>
          <p className="mt-4 text-xl text-white">
            The smart flashcard app that helps you learn faster and remember
            longer. Stop cramming, start learning intelligently.
          </p>
          <Link
            to="/category"
            className="mt-8 inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
          >
            Get Started for Free
          </Link>
        </div>
      </div>

      <main>
        {/* Feature Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Learn Smarter
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to conquer your exams
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our platform is built on proven learning principles to help you
                achieve your academic and professional goals.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                How it Works
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A simple path to long-term knowledge
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Follow these three simple steps to start learning effectively.
              </p>
            </div>
            <div className="relative mt-16 overflow-hidden">
              <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <PencilSquareIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    1. Create
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Create your own flashcards with the information you want to
                    learn.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ArrowPathIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    2. Review
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Our system tells you the optimal time to review each card.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    3. Master
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Retain knowledge for the long term and track your mastery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-indigo-600">
                Start learning for free today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/authenticate"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Sign up now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

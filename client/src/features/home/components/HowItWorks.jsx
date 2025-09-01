import {
  ArrowPathIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const HowItWorks = (props) => {
  const howItWorksRef = props.ref;

  const steps = [
    {
      number: "01",
      title: "Create & Organize",
      description:
        "Build your flashcards with our simple editor. Add questions and answers, then organize them by categories for easy management.",
      icon: PencilSquareIcon,
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "Simple text editor",
        "Category organization",
        "Easy management",
      ],
    },
    {
      number: "02",
      title: "Review System",
      description:
        "Use spaced repetition to review your flashcards. Mark cards as Perfect, Close, or Difficult to focus on the ones that need more attention.",
      icon: ArrowPathIcon,
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Study Flashcards",
        "Difficulty assesement",
        "Focus Review Sessions",
      ],
    },
    {
      number: "03",
      title: "Track Progress",
      description:
        "Monitor your learning progress with simple statistics. See which cards you've mastered and which ones need more work.",
      icon: CheckCircleIcon,
      gradient: "from-emerald-500 to-teal-500",
      features: [
        "Interactive Quiz",
        "Performance Overview",
        "Focus Quiz Sessions",
      ],
    },
  ];

  return (
    <section
      ref={howItWorksRef}
      className="relative bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-800 dark:text-indigo-200">
              <PlayIcon className="w-4 h-4 mr-2" />
              Simple 3-Step Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Get started in minutes with this simple, effective approach to
            flashcard learning.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-teal-500 transform -translate-x-1/2"></div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} mb-6 shadow-lg`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                        STEP {step.number}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-sm text-indigo-600 dark:text-indigo-400"
                        >
                          <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800`}
                  >
                    <span className="text-white font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg mr-4`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      STEP {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {step.description}
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-sm text-indigo-600 dark:text-indigo-400"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;

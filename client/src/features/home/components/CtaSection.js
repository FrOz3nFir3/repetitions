import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { Link } from "react-router-dom";
import React from "react";
import {
  RocketLaunchIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const CtaSection = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-white/10 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/15 rounded-full animate-bounce animation-delay-3000"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            <span className="block">Ready to Transform</span>
            <span className="pb-4 block bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Your Learning Journey?
            </span>
          </h2>

          {/* Subheading */}
          <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-gray-200 leading-relaxed mb-12">
            Experience the power of spaced repetition learning with this open
            source flashcard application.
            <span className="font-semibold text-white">
              {" "}
              Start learning today - it's completely free.
            </span>
          </p>

          {/* Open Source Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                100%
              </div>
              <div className="text-gray-300">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Free
              </div>
              <div className="text-gray-300">Forever</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Unlicense
              </div>
              <div className="text-gray-300">No Restrictions</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {user ? (
              <>
                <Link
                  to="progress"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-900 bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                >
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  View Your Progress
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/category"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 min-w-[200px]"
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Continue Learning
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/authenticate"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-900 bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                >
                  Register / Login
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/category"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 min-w-[200px]"
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Start Learning
                </Link>
              </>
            )}
          </div>

          {/* Open Source Info */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-300 text-sm mb-4">
              Open source project available on GitHub
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <a
                href="https://github.com/FrOz3nFir3/repetitions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-white font-semibold">Unlicense</span>
              <span className="text-gray-400">•</span>
              <span className="text-white font-semibold">No Restrictions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;

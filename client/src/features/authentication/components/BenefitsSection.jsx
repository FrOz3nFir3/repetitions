import React from "react";
import FeatureCard from "./FeatureCard";
import { guestFeatures, memberFeatures } from "../lib/constants";
import {
  EyeIcon,
  UserCircleIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const BenefitsSection = () => {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Feature Comparison Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        <FeatureCard
          title="Try It Free"
          subtitle="No signup required"
          icon={EyeIcon}
          features={guestFeatures}
        />
        <FeatureCard
          title="Full Access"
          subtitle="Everything included"
          icon={UserCircleIcon}
          features={memberFeatures}
          isHighlight
        />
      </div>

      {/* Key Benefits Highlight */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          🚀 Why Join Our Learning Community?
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <PlusCircleIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Create & Share
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build unlimited flashcard decks and contribute to the community
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Track Progress
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Detailed analytics show your learning journey and improvements
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <PencilSquareIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Edit & Improve
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enhance any card with your name, email credited in the activity
                timeline
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Own Your Content
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Full control over cards you create, including deletion rights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;

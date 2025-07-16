import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

const RandomFact = ({ fact, loading }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (loading || !fact) return;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fact, loading]);

  if (!fact && !loading) return null;

  return (
    <div
      ref={containerRef}
      className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-800/50 animate-fade-in"
    >
      <div className="flex items-center mb-2">
        <SparklesIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-3" />
        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">
          Did you know?
        </h4>
      </div>
      <div className="text-yellow-700 dark:text-yellow-300 pl-9">
        {loading ? <SkeletonLoader /> : fact}
      </div>
    </div>
  );
};

export default RandomFact;

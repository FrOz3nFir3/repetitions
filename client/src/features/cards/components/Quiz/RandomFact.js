import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-700 dark:to-orange-700 rounded-full w-3/4"></div>
    <div className="h-4 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-700 dark:to-orange-700 rounded-full w-1/2"></div>
    <div className="h-4 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-700 dark:to-orange-700 rounded-full w-2/3"></div>
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
      className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 shadow-2xl border-2 border-yellow-200/50 dark:border-yellow-700/50 animate-fade-in"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
              Did you know?
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Fun fact while you wait
            </p>
          </div>
        </div>

        <div className="text-yellow-800 dark:text-yellow-200 text-lg leading-relaxed font-medium">
          {loading ? <SkeletonLoader /> : fact}
        </div>
      </div>
    </div>
  );
};

export default RandomFact;

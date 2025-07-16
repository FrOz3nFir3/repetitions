import React from "react";

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
      className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg shadow-md animate-fade-in"
    >
      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
        Did you know?
      </h4>
      <p className="text-blue-700 dark:text-blue-300">
        {loading ? "Loading interesting fact..." : fact}
      </p>
    </div>
  );
};

export default RandomFact;

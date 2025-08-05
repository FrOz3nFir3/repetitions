import React, { useState, useEffect, Suspense } from "react";
import CardLogSkeleton from "../../../components/ui/skeletons/CardLogSkeleton";

const LazyDiffViewer = (props) => {
  const [DiffViewer, setDiffViewer] = useState(null);

  useEffect(() => {
    import("react-diff-viewer-continued")
      .then((module) => {
        setDiffViewer(() => module.default);
      })
      .catch((err) => {
        console.error("Failed to load ReactDiffViewer:", err);
      });
  }, []);

  if (!DiffViewer) {
    return <CardLogSkeleton />;
  }

  return (
    <Suspense fallback={<CardLogSkeleton />}>
      <DiffViewer {...props} />
    </Suspense>
  );
};

export default LazyDiffViewer;

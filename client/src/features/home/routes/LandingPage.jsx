import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";

const CtaSection = React.lazy(() => import("../components/CtaSection"));
const HowItWorks = React.lazy(() => import("../components/HowItWorks"));

const LandingPage = () => {
  const howItWorksRef = useRef(null);

  const handleLearnMoreClick = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 text-slate-800 dark:text-slate-200 min-h-screen">
      <HeroSection onLearnMoreClick={handleLearnMoreClick} />
      <FeaturesSection />
      <HowItWorks ref={howItWorksRef} />
      <CtaSection />
    </div>
  );
};

export default LandingPage;

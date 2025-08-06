import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../state/authSlice";
import { useNavigate } from "react-router-dom";

import BenefitsSection from "../components/BenefitsSection";
import AuthPageHeader from "../components/AuthPageHeader";
import AuthFormCard from "../components/AuthFormCard";

function AuthenticationPage() {
  const user = useSelector(selectCurrentUser);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <AuthPageHeader />

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column: Benefits */}
          <BenefitsSection />

          {/* Right Column: Auth Form */}
          <div className="lg:col-span-1">
            <AuthFormCard isLogin={isLogin} onTabChange={setIsLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;

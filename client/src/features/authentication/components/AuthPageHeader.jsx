import React from "react";

const AuthPageHeader = () => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
          Master Any Subject
        </span>
      </h1>
      <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Transform your learning with intelligent flashcards and spaced
        repetition.
      </p>
    </div>
  );
};

export default AuthPageHeader;

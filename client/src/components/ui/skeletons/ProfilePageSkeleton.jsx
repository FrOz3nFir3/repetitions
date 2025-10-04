import React from "react";

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      <div className="relative">
        <div className="container mx-auto 2xl:max-w-7xl px-4 py-8 animate-pulse">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-3xl"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg max-w-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-32"></div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-32"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;

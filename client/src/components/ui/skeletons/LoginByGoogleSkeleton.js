import React from "react";

const LoginSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center justify-center">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>
  );
};

export default LoginSkeleton;

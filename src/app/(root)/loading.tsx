import React from "react";

const loading: React.FC = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default loading;

import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="h-[60vh] w-full flex justify-center items-center">
      <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;

import React from "react";

const LoadingInfinity = ({ className }: { className?: string }) => {
  return (
    <div
      className={`flex justify-center items-center flex-col gap-4 ${className}`}
    >
      <span className="loading loading-infinity w-[100px] text-center align-middle"></span>
      <p>Loading Episodes...</p>
    </div>
  );
};

export default LoadingInfinity;

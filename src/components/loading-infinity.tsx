import React from "react";

const LoadingInfinity = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 mt-10">
      <span className="loading loading-infinity w-[100px] text-center align-middle"></span>
      <p>Loading Episodes...</p>
    </div>
  );
};

export default LoadingInfinity;

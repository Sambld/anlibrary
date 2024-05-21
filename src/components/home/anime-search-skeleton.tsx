import React from "react";
type AnimeSearchSkeletonProps = {
  type: "search" | "schedule";
};
const AnimeSearchSkeleton = ({ type }: AnimeSearchSkeletonProps) => {
  return (
    <div className="flex gap-4 flex-wrap justify-start">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((_, i) => (
        <div
          key={i}
          className="w-[165px] h-[300px] max-sm:w-[150px] dark:bg-zinc-900 bg-slate-100 rounded-lg"
        >
          <div className="relative w-full h-[200px] ">
            <div className="w-full h-full dark:bg-gray-500 bg-gray-300 animate-pulse"></div>
          </div>
          <div className="p-2">
            <div className="w-3/4 h-4 dark:bg-gray-600 bg-gray-300 animate-pulse"></div>
            <div className="w-1/2 h-3 dark:bg-gray-600 bg-gray-300 animate-pulse mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSearchSkeleton;

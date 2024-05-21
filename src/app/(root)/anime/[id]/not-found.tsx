import React from "react";
import Link from "next/link";

const notfound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
        Oops!
      </h1>
      <p className="text-xl text-gray-600 text-center dark:text-gray-300 mb-8">
        Something went wrong. Please try again later.
      </p>
      <Link
        href="javascript:history.back()"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back
      </Link>
    </div>
  );
};

export default notfound;

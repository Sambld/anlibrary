"use client";
import { releasers } from "@/constants/consts";
import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { release } from "os";

type FavouriteReleasersProps = {
  favourite_releasers: string;
  toggleFavouriteReleaser: (releaser: string) => void;
};
const FavouriteReleasers = ({
  favourite_releasers,
  toggleFavouriteReleaser,
}: FavouriteReleasersProps) => {
  const favourite_releasers_array = favourite_releasers.split(",");
  return (
    <div className="mt-6">
      <div className="border-l-teal-600 border-l-8 pl-4 py-2 ">
        <h2 className="text-lg ">Releasers</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {releasers.map((releaser) => (
            <Badge
              onClick={() => toggleFavouriteReleaser(releaser)}
              key={releaser}
              className={cn(
                `rounded-sm px-3 py-1 cursor-pointer`,
                favourite_releasers_array.includes(releaser)
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-200 dark:text-gray-800 text-black hover:bg-gray-300 "
              )}
            >
              {releaser}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavouriteReleasers;

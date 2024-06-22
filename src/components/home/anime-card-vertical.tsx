import Image from "next/image";
import Link from "next/link";
import React from "react";

type AnimeCardProps = {
  mal_id: number;
  title: string;
  episodes: number | "?";
  image: string;
  download?: boolean;
};
const AnimeCard = ({
  mal_id,
  title,
  episodes,
  image,
  download = false,
}: AnimeCardProps) => {
  return (
    <div className="relative transition hover:scale-[97%] duration-200 group">
      <Link href={`/anime/${mal_id}`} className="peer">
        <div className="w-[165px] min-h-[280px] max-sm:w-[150px]  dark:bg-zinc-900 bg-slate-100 rounded-lg ">
          {/* <div className="w-[220px] min-h-[310px] max-sm:w-[150px]  dark:bg-zinc-900 bg-slate-100 rounded-lg"> */}
          <div className="relative w-full h-[200px] ">
            <Image
              src={image}
              alt="anime"
              width={165}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 py-4">
            <h1 className="text-sm  text-vibrant_blue font-semibold line-clamp-2">
              {title}
            </h1>
            <p className="text-xs text-gray-500">Episodes: {episodes}</p>
          </div>
        </div>
      </Link>
      {download && (
        <Link href={`/anime/${mal_id}/download`}>
          <div className="absolute top-[168px] w-full text-center right-0 p-2 bg-green-600 text-white rounded-bl-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-xs">Go to download page</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default AnimeCard;

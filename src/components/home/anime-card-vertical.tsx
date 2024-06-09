import Image from "next/image";
import Link from "next/link";
import React from "react";

type AnimeCardProps = {
  mal_id: number;
  title: string;
  episodes: number | "?";
  image: string;
};
const AnimeCard = ({ mal_id, title, episodes, image }: AnimeCardProps) => {
  return (
    <Link href={`/anime/${mal_id}`}>
      <div className="w-[165px] min-h-[280px] max-sm:w-[150px]  dark:bg-zinc-900 bg-slate-100 rounded-lg transition hover:scale-[97%] duration-200">
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
  );
};

export default AnimeCard;

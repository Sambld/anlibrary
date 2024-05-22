import Image from "next/image";
import Link from "next/link";
import React from "react";
import EpisodeBroadcastCountDown from "./episode-broadcast-countdown";
import { Button } from "../ui/button";
type AnimeCardHorizontalProps = {
  mal_id: number;
  title: string;
  episodes: number | "?";
  image: string;
  duration: string;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
};
const AnimeCardHorizontal = ({
  mal_id,
  title,
  episodes,
  image,
  duration,
  broadcast,
}: AnimeCardHorizontalProps) => {
  return (
    <Link href={`/anime/${mal_id}`}>
      <div className=" h-[200px] w-[480px] max-sm:w-full flex   dark:bg-zinc-900 bg-slate-100 rounded-lg">
        <div className="relative  h-full ">
          <Image
            src={image}
            alt="anime"
            width={165}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 py-4 px-4">
          <h1 className="text-lg  text-vibrant_blue font-semibold line-clamp-1">
            {title}
          </h1>
          <p className="text-base text-gray-500">Episodes: {episodes}</p>
          <p className="text-base text-gray-500">Duration: {duration}</p>
          <p className="text-base text-gray-500">
            Broadcast: {broadcast.string}
          </p>
          <EpisodeBroadcastCountDown broadcast={broadcast} />

          <Link href={`/anime/${mal_id}/download`}>
            <Button className="mt-2">Go to download page</Button>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCardHorizontal;

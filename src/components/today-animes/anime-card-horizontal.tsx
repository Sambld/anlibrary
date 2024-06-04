import Image from "next/image";
import Link from "next/link";
import React from "react";
import EpisodeBroadcastCountDown from "./episode-broadcast-countdown";
import { Button } from "../ui/button";
import DownloadButton from "../download-button";
type AnimeCardHorizontalProps = {
  mal_id: number;
  title: string;
  episodes: number | "?";
  image: string;
  duration: string;
  broadcast: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
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
    <div>
      <div className=" min-h-[220px] w-[480px] max-sm:w-full flex max-sm:flex-col dark:bg-zinc-900 bg-slate-100 rounded-lg">
        <div className=" relative max-sm:w-full min-w-[160px] flex items-center max-sm:pt-4 max-sm:pl-4">
          <Image
            src={image}
            alt="anime"
            width={160}
            height={200}
            className="object-cover rounded-l-lg items-center inline-block align-middle"
          />
        </div>
        <div className="p-3 py-4 px-4">
          <Link href={`/anime/${mal_id}`}>
            <h1 className="text-lg max-sm:text-base  text-vibrant_blue font-semibold line-clamp-1 hover:underline">
              {title}
            </h1>
          </Link>
          <p className="text-base max-sm:text-sm  text-gray-500">
            Episodes: {episodes}
          </p>
          <p className="text-base max-sm:text-sm text-gray-500">
            Duration: {duration}
          </p>
          <p className="text-base max-sm:text-sm text-gray-500">
            Broadcast: {broadcast.string}
          </p>
          <EpisodeBroadcastCountDown broadcast={broadcast} />

          <Link href={`/anime/${mal_id}/download`}>
            <DownloadButton
              href="/anime/[id]/download"
              className="mt-2 max-sm:w-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeCardHorizontal;

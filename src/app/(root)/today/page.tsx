import { weekDays } from "@/constants/consts";
import { getAnimeScheduleByDay } from "@/lib/jikan_api/api";
import React from "react";
import AnimeCardHorizontal from "@/components/today-animes/anime-card-horizontal";

export const dynamic = "force-dynamic";
const TodayAnimes = async () => {
  const today = weekDays[new Date().getDay()];

  const todayanimes = await getAnimeScheduleByDay(today);

  return (
    <div className="flex flex-col gap-5 p-10 max-sm:p-4 mb-12">
      <h1 className="text-2xl font-bold">Today Animes Schedule</h1>

      <div className="flex flex-wrap gap-3 max-sm:flex-col max-sm:gap-1">
        {todayanimes.data.map((anime) => (
          <AnimeCardHorizontal
            key={anime.mal_id}
            mal_id={anime.mal_id}
            title={anime.title}
            image={anime.images.webp.image_url}
            episodes={anime.episodes || "?"}
            duration={anime.duration}
            broadcast={anime.broadcast}
          />
        ))}
      </div>
    </div>
  );
};

export default TodayAnimes;

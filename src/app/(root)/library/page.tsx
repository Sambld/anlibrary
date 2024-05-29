import AnimeCard from "@/components/home/anime-card-vertical";
import { weekDays } from "@/constants/consts";
import { getLibrary } from "@/lib/actions/library";
import React from "react";

const Library = async () => {
  const { library } = await getLibrary();

  const today = weekDays[new Date().getDay()];
  const airingToday = library.filter((anime) => anime.broadcastDay === today);
  console.log(airingToday);
  const notAiringToday = library.filter(
    (anime) => anime.broadcastDay !== today
  );

  // console.log(library);
  return (
    <div className="text-2xl font-bold p-10 max-sm:p-4 ">
      <p className="text-2xl font-bold">My Library</p>

      {airingToday.length > 0 && (
        <div className="mt-5">
          <p className="text-xl font-bold">
            Airing Today {airingToday.length} {today}
          </p>
          <div className="flex flex-wrap gap-4">
            {airingToday.map((anime) => (
              <AnimeCard
                key={anime.animeId}
                episodes={anime.episodes}
                image={anime.image}
                mal_id={anime.animeId}
                title={anime.title}
              />
            ))}
          </div>
        </div>
      )}

      {notAiringToday.length > 0 && (
        <div className="mt-5">
          <p className="text-xl font-bold">Not Airing Today</p>
          <div className="flex flex-wrap gap-4">
            {notAiringToday.map((anime) => (
              <AnimeCard
                key={anime.animeId}
                episodes={anime.episodes}
                image={anime.image}
                mal_id={anime.animeId}
                title={anime.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

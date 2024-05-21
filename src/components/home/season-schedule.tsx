import { weekDays } from "@/constants";
import AnimeCard from "./AnimeCard";
import { AnimeSchedule } from "@/myanimelist_api/types";
import { getAnimeSchedule } from "@/myanimelist_api/api";

export const SeasonSchedule = async () => {
  const seasonAnimes = await getAnimeSchedule();

  return (
    <div className="">
      {weekDays.map((day) => (
        <div key={day} className="flex flex-col gap-4 mt-6">
          <div className="border-l-teal-600 border-l-8 pl-4 py-2">
            <h2 className="text-xl ">{day}</h2>
          </div>

          <div className="flex gap-4 flex-wrap  justify-evenly">
            {seasonAnimes[day].data.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                mal_id={anime.mal_id}
                title={anime.title}
                episodes={anime.episodes!}
                image={anime.images.webp.image_url}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

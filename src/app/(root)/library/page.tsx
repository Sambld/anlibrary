import AnimeCard from "@/components/home/anime-card-vertical";
import { Button } from "@/components/ui/button";
import { weekDays } from "@/constants/consts";
import { getLibrary } from "@/lib/library";
import Link from "next/link";
import React from "react";

// force reload on every page load

export const dynamic = "force-dynamic";

const Library = async () => {
  const { library } = await getLibrary();

  const today = weekDays[new Date().getDay()];

  const airingToday = library.filter((anime) => anime.broadcastDay === today);
  // const notAiringToday = library.filter(
  //   (anime) => anime.broadcastDay !== today
  // );
  return (
    <>
      <div className="text-2xl font-bold p-10 max-sm:p-4 ">
        <p className="text-2xl font-bold">
          My Library <span className="text-sm">({library.length})</span>
        </p>

        {airingToday.length > 0 && (
          <div className="mt-5">
            <div className="border-l-teal-600 border-l-8 pl-4 py-2 ">
              <h2 className="text-xl ">
                Airing Today{" "}
                <span className=" text-sm"> ({airingToday.length})</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {airingToday.map((anime) => (
                <AnimeCard
                  download={true}
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

        {library.length > 0 && (
          <div className="mt-5">
            <div className="border-l-teal-600 border-l-8 pl-4 py-2">
              <h2 className="text-xl ">All Animes</h2>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {library.map((anime) => (
                <AnimeCard
                  download={true}
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
      <div className="flex  flex-col mt-10 gap-2 justify-center items-center text-center">
        {library.length === 0 && (
          <div className="mt-5">
            <p className="text-xl font-bold">Library is empty</p>
            <p className="text-xl font-bold">Add new animes</p>
            <Link href="/">
              <Button className="mt-5 border" variant="secondary">
                Discover
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Library;

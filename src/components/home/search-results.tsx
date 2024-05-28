import { PaginationLinks } from "../pagination";
import AnimeCard from "./anime-card-vertical";
import { getAnimeBySearchQuery } from "@/lib/jikan_api/api";
export const dynamic = "force-dynamic";
export const SearchResults = async ({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) => {
  const searchResults = await getAnimeBySearchQuery({
    q: searchQuery,
    page: page,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap max-sm:justify-evenly justify-start">
        {searchResults.data.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            mal_id={anime.mal_id}
            title={anime.title}
            episodes={anime.episodes || "?"}
            image={anime.images.webp.image_url}
          />
        ))}
      </div>
      <PaginationLinks pagination={searchResults.pagination} />
    </div>
  );
};

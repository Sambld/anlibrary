/* eslint-disable react/display-name */
import AnimeCard from "@/components/home/AnimeCard";
import AnimeSearchSkeleton from "@/components/home/anime-search-skeleton";
import SearchInput from "@/components/home/search-input";
import { SearchResults } from "@/components/home/search-results";
import { SeasonSchedule } from "@/components/home/season-schedule";
import { Input } from "@/components/ui/input";
import { weekDays } from "@/constants";
import { getAnimeBySearchQuery, getAnimeSchedule } from "@/myanimelist_api/api";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    page?: number;
  };
}) {
  const query = searchParams?.q || "";
  const page = searchParams?.page || 1;
  // fake delay
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <section className="flex flex-col gap-4 p-10 max-sm:p-4">
      <h1 className="text-lg">
        {query ? `Searching for ( ${query} )` : "Current Season Schedule"}
      </h1>
      <SearchInput />
      {query ? (
        <Suspense
          key={query + page}
          fallback={<AnimeSearchSkeleton type={"search"} />}
        >
          <SearchResults searchQuery={query} page={page} />
        </Suspense>
      ) : (
        <SeasonSchedule />
      )}
    </section>
  );
}

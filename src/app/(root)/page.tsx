/* eslint-disable react/display-name */
import AnimeSearchSkeleton from "@/components/home/anime-search-skeleton";
import SearchInput from "@/components/home/search-input";
import { SearchResults } from "@/components/home/search-results";
import { SeasonSchedule } from "@/components/home/season-schedule";
import { cookies } from "next/headers";
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

  // const cookieStore = cookies();
  // console.log(cookieStore.getAll());

  return (
    <section className="flex flex-col gap-4 p-10 max-sm:p-4">
      <h1 className="text-2xl font-bold">
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
        // <></>
        <SeasonSchedule />
      )}
    </section>
  );
}

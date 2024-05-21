import { JIKAN_BASE_URL, weekDays } from "@/constants";
import {
  AnimeScheduleDay,
  AnimeSchedule,
  AnimeBySearchQuery,
  Anime,
  AnimeFull,
} from "./types";
import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";

export const getAnimeScheduleByDay = async (
  day: string
): Promise<AnimeScheduleDay> => {
  // delay for testing
  const url = `${JIKAN_BASE_URL}/schedules?filter=${day}&kids=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch anime schedule");
  }
  const result: AnimeScheduleDay = await response.json();
  // getting all the animes from the next page if there is one
  console.log(result.pagination.has_next_page);
  if (result.pagination.has_next_page) {
    console.log("fetching next page");
    const response = await fetch(url + `&page=2`);
    const result2: AnimeScheduleDay = await response.json();
    result.data = result.data.concat(result2.data);
  }
  return result;
};

export const getAnimeSchedule = async (): Promise<AnimeSchedule> => {
  let result = {} as AnimeSchedule;
  for (const day of weekDays) {
    // await new Promise((resolve) => setTimeout(resolve, 400));
    result[day] = await getAnimeScheduleByDay(day);
  }
  return result;
};

export const getAnimeBySearchQuery = async ({
  q,
  page = 1,
  filter,
}: {
  q: string;
  page: number;
  filter?: string;
}): Promise<AnimeBySearchQuery> => {
  // console.log("q", q, "page", page);
  // fake delay
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const url = `${JIKAN_BASE_URL}/anime?q=${q}&page=${page}&sfw=true`;
  console.log(url);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch anime search results");
  }
  return response.json();
};

export const getFullAnimeById = async (
  id: string
): Promise<{ data: AnimeFull }> => {
  const url = `${JIKAN_BASE_URL}/anime/${id}/full`;
  const response = await fetch(url);
  if (!response.ok) {
    notFound();
    // throw new Error("Failed to fetch anime");
  }
  return response.json();
};

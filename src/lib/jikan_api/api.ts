import { JIKAN_BASE_URL, weekDays } from "@/constants/consts";
import {
  AnimeScheduleDay,
  AnimeSchedule,
  AnimeBySearchQuery,
  Anime,
  AnimeFull,
} from "./types";
import { notFound } from "next/navigation";

export const getAnimeScheduleByDay = async (
  day: string
): Promise<AnimeScheduleDay> => {
  const url = `${JIKAN_BASE_URL}/schedules?filter=${day}&kids=false&kids=false`;
  let condition = true;
  let response;
  do {
    response = await fetch(url, { next: { revalidate: 360 } });
    if (!response.ok) {
      // throw new Error("Failed to fetch anime schedule by day");
      console.error(url);
      console.log("Failed to fetch anime schedule by day retrying...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    condition = !response.ok;
  } while (condition);

  const result: AnimeScheduleDay = await response.json();
  // getting all the animes from the next page if there is one
  if (result.pagination.has_next_page) {
    const response = await fetch(url + `&page=2`);
    const result2: AnimeScheduleDay = await response.json();
    result.data = result.data.concat(result2.data);
  }
  return result;
};

export const getAnimeSchedule = async (): Promise<AnimeSchedule> => {
  let result = {} as AnimeSchedule;
  for (const day of weekDays) {
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
  const url = `${JIKAN_BASE_URL}/anime?q=${q}&page=${page}&sfw=true`;
  const response = await fetch(url, { next: { revalidate: 3600 * 24 } });
  if (!response.ok) {
    throw new Error("Failed to fetch anime search results");
  }
  return response.json();
};

export const getFullAnimeById = async (
  id: string
): Promise<{ data: AnimeFull }> => {
  const url = `${JIKAN_BASE_URL}/anime/${id}/full`;
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    notFound();
  }
  return response.json();
};
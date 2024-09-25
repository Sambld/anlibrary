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
  response = await fetchWithRetry(url, { next: { revalidate: 3600 * 24 * 7 } });
  if (!response.ok) {
    console.log("Failed to fetch anime schedule by day retrying...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const result: AnimeScheduleDay = await response.json();
  // getting all the animes from the next page if there is one
  if (result.pagination.has_next_page) {
    const response = await fetchWithRetry(`${url}&page=2`, {
      next: { revalidate: 360 },
    });
    const result2: AnimeScheduleDay = await response.json();
    result.data = result.data.concat(result2.data);
  }
  return result;
};

export const getAnimeSchedule = async (): Promise<AnimeSchedule> => {
  let result = {} as AnimeSchedule;
  for (const day of weekDays) {
    await new Promise((resolve) => setTimeout(resolve, 300));
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
  const response = await fetchWithRetry(url, {
    next: { revalidate: 3600 * 24 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch anime search results");
  }
  return response.json();
};

export const getFullAnimeById = async (
  id: string
): Promise<{ data: AnimeFull }> => {
  const url = `${JIKAN_BASE_URL}/anime/${id}/full`;
  const response = await fetchWithRetry(url, {
    next: { revalidate: 3600 * 24 },
  });
  const result: { data: AnimeFull } = await response.json();
  if (!response.ok || result.data === undefined) {
    notFound();
  }

  return result;
};

export const fetchWithRetry = async (
  url: string,
  cacheOptions: RequestInit
) => {
  let condition = true;
  const maxRetries = 10;
  let retryCount = 0;
  let response = null;
  do {
    response = await fetch(url, cacheOptions);
    if (!response.ok) {
      console.error(url);
      console.log("Failed to fetch retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    condition = !response.ok;

    retryCount++;
  } while (condition && retryCount < maxRetries);
  return response;
};

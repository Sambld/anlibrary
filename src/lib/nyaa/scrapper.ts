import { NYAA_BASE_URL } from "@/constants/consts";
import * as cheerio from "cheerio";
import { getEpisodes, getSearchResultCount } from "./helpers";
import { NyaaEpisode } from "./types";
import { animeNameShaper } from "../utils";

export const getNyaaSearchUrl = (query: string, filters = "", page = 1) => {
  return `${NYAA_BASE_URL}/?f=0&c=1_2&q=${encodeURIComponent(
    query
  )}&p=${page}&${filters}`;
};

export const getAnimeEpisodesByReleasers = async ({
  animeName,
  releasers,
}: {
  animeName: {
    english: string;
    japanese: string;
  };
  releasers: string[];
}) => {
  try {
    const maxPages = 3;
    let allEpisodes: NyaaEpisode[] = [];
    const shapedEnglishName = animeNameShaper(animeName.english);
    const shapedJapaneseName = animeNameShaper(animeName.japanese);

    // Combine all releasers into a single search query
    const combinedQuery = `( (${releasers.join(
      "|"
    )}) ${shapedEnglishName} )| ( (${releasers.join(
      "|"
    )}) ${shapedJapaneseName} )`;

    for (let page = 1; page <= maxPages; page++) {
      const searchUrl = getNyaaSearchUrl(combinedQuery, "o=desc", page);
      // console.log(searchUrl);

      const response = await fetch(searchUrl, { cache: "no-store" });
      const html = await response.text();
      const $ = cheerio.load(html);

      const items = getEpisodes({ $ });
      allEpisodes = [...allEpisodes, ...items];

      const { total } = getSearchResultCount($);
      if (total <= page * 75) {
        break;
      }
    }

    // Separate episodes based on releaser
    const episodesByReleaser: { [key: string]: NyaaEpisode[] } = {};
    for (const episode of allEpisodes) {
      const matchingReleaser = releasers.find((releaser) =>
        episode.title.toLowerCase().includes(releaser.toLowerCase())
      );
      if (matchingReleaser) {
        if (!episodesByReleaser[matchingReleaser]) {
          episodesByReleaser[matchingReleaser] = [];
        }
        episodesByReleaser[matchingReleaser].push(episode);
      }
    }

    return episodesByReleaser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAnimeBatches = async ({
  animeTitle,
}: {
  animeTitle: {
    english: string;
    japanese: string;
  };
}) => {
  const shapedAnimeTitle = animeNameShaper(animeTitle.english);
  const shapedAnimeTitleJapanese = animeNameShaper(animeTitle.japanese);
  try {
    const searchUrls = [
      getNyaaSearchUrl(
        `
        ${shapedAnimeTitle} BD`,
        "s=seeders&o=desc"
      ),
      getNyaaSearchUrl(`${shapedAnimeTitle} Batch`, "s=seeders&o=desc"),
      getNyaaSearchUrl(`${shapedAnimeTitleJapanese} BD`, "s=seeders&o=desc"),
      getNyaaSearchUrl(`${shapedAnimeTitleJapanese} Batch`, "s=seeders&o=desc"),
    ];
    // console.log(searchUrls);

    // Fetch both URLs in parallel
    const [responseBD, responseBatch] = await Promise.all(
      searchUrls.map((url) => fetch(url, { next: { revalidate: 360 } }))
    );

    // Parse both responses in parallel
    const [htmlBD, htmlBatch] = await Promise.all([
      responseBD.text(),
      responseBatch.text(),
    ]);

    // Load the HTML content into Cheerio
    const $BD = cheerio.load(htmlBD);
    const $Batch = cheerio.load(htmlBatch);

    // Get episodes from both responses
    const episodesBD = getEpisodes({ $: $BD, filters: { activeOnly: true } });
    const episodesBatch = getEpisodes({
      $: $Batch,
      filters: { activeOnly: true },
    });

    // Combine the episodes and remove duplicates if necessary
    const episodesSet = new Set<NyaaEpisode>([...episodesBD, ...episodesBatch]);
    const episodes = Array.from(episodesSet);

    // sort episodes by seeders
    return episodes.sort((a, b) => b.seeders - a.seeders);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw error after logging
  }
};

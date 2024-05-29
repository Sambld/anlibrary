import { NYAA_BASE_URL } from "@/constants/consts";
import * as cheerio from "cheerio";
import { getEpisodes, getSearchResultCount } from "./helpers";
import { NyaaEpisode } from "./types";
import { animeNameShaper } from "../utils";
export const getNyaaSearchUrl = (query: string, filters = "", page = 1) => {
  return `${NYAA_BASE_URL}/?f=0&c=1_2&q=${query}&p=${page}&${filters}`;
};

export const getAnimeSearchPageByReleaser = async ({
  animeName,
  releaser,
  page,
}: {
  animeName: string;
  releaser: string;
  page?: number;
}) => {
  try {
    const searchUrl = getNyaaSearchUrl(`${releaser} ${animeName}`);
    // console.log(searchUrl);
    const response = await fetch(searchUrl, { next: { revalidate: 360 } });
    const html = await response.text();
    const $ = cheerio.load(html);
    return $;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeEpisodesByReleaser = async ({
  animeName,
  releaser,
}: {
  animeName: string;
  releaser: string;
}): Promise<NyaaEpisode[] | undefined> => {
  try {
    const maxPages = 2;
    let episodes: NyaaEpisode[] = [];
    animeName = animeNameShaper(animeName);
    for (let page = 1; page <= maxPages; page++) {
      const searchPage = await getAnimeSearchPageByReleaser({
        animeName,
        releaser,
        page,
      });
      if (searchPage) {
        const items = getEpisodes({ $: searchPage });
        episodes = [...episodes, ...items];
        const { total } = getSearchResultCount(searchPage);
        if (total <= page * 75) {
          break;
        }
      }
    }
    return episodes;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeEpisodesByReleasers = async ({
  animeName,
  releasers,
}: {
  animeName: string;
  releasers: string[];
}) => {
  try {
    let episodes: {
      [key: string]: NyaaEpisode[];
    } = {};
    for (const releaser of releasers) {
      const releaserEpisodes = await getAnimeEpisodesByReleaser({
        animeName,
        releaser,
      });
      if (releaserEpisodes && releaserEpisodes?.length > 0) {
        episodes[releaser] = releaserEpisodes;
      }
    }
    return episodes;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeBatches = async (animeTitle: string) => {
  try {
    const searchUrls = [
      getNyaaSearchUrl(`${animeTitle} BD`, "s=seeders&o=desc"),
      getNyaaSearchUrl(`${animeTitle} Batch`, "s=seeders&o=desc"),
    ];

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
    const episodesBD = getEpisodes({ $: $BD, filters: { onlyActive: true } });
    const episodesBatch = getEpisodes({
      $: $Batch,
      filters: { onlyActive: true },
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

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
    console.log(searchUrl);
    const response = await fetch(searchUrl, { next: { revalidate: 360 } });
    const html = await response.text();
    const $ = cheerio.load(html);
    return $;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAnimeEpisodesByReleaser = async ({
  animeName,
  releaser,
}: {
  animeName: string;
  releaser: string;
}): Promise<NyaaEpisode[]> => {
  try {
    const maxPages = 1;
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
    throw error;
  }
};

export const getAnimeEpisodesByReleasers = async ({
  animeName,
  releasers,
}: {
  animeName: {
    default: string;
    english?: string;
  };
  releasers: string[];
}) => {
  try {
    let episodes: {
      [key: string]: NyaaEpisode[];
    } = {};
    for (const releaser of releasers) {
      let releaserEpisodes: NyaaEpisode[] = [];

      for (let languageName of [animeName.default, animeName.english]) {
        if (languageName) {
          const _releaserEpisodes = await getAnimeEpisodesByReleaser({
            animeName: languageName,
            releaser,
          });
          if (_releaserEpisodes && _releaserEpisodes?.length > 0) {
            const episodesSet = new Set<NyaaEpisode>([
              ...releaserEpisodes,
              ..._releaserEpisodes,
            ]);

            releaserEpisodes = Array.from(episodesSet);
            break;
          }
        }
      }
      episodes[releaser] = releaserEpisodes;
    }
    return episodes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAnimeBatches = async ({
  animeTitle,
}: {
  animeTitle: {
    default: string;
    english?: string;
  };
}) => {
  const shapedAnimeTitle = animeNameShaper(animeTitle.default);
  const shapedAnimeTitleJapanese =
    animeTitle.english !== undefined
      ? animeNameShaper(animeTitle.english)
      : null;
  try {
    let searchUrls = [
      getNyaaSearchUrl(`${shapedAnimeTitle} BD`, "s=seeders&o=desc"),
      getNyaaSearchUrl(`${shapedAnimeTitle} Batch`, "s=seeders&o=desc"),
    ];
    if (shapedAnimeTitleJapanese) {
      searchUrls.push(
        getNyaaSearchUrl(`${shapedAnimeTitleJapanese} BD`, "s=seeders&o=desc")
      );
      searchUrls.push(
        getNyaaSearchUrl(
          `${shapedAnimeTitleJapanese} Batch`,
          "s=seeders&o=desc"
        )
      );
    }

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
    const episodesSet = [...episodesBD, ...episodesBatch];

    // remove duplicates
    const episodes = episodesSet.filter((obj, index) => {
      return index === episodesSet.findIndex((o) => obj.title === o.title);
    });

    // sort episodes by seeders
    const orderedEpisodes = episodes.sort((a, b) => b.seeders - a.seeders);
    return orderedEpisodes;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw error after logging
  }
};

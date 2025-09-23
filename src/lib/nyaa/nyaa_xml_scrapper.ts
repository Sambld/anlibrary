import { NYAA_BASE_URL } from "@/constants/consts";
import { NyaaEpisode } from "./types";
import { animeNameShaper } from "../utils";

/**
 * XML-based Nyaa scrapper using RSS feeds
 * More efficient and reliable than HTML scraping
 */

export const getNyaaRSSUrl = (query: string, filters = "", page = 1) => {
  return `${NYAA_BASE_URL}/?page=rss&q=${encodeURIComponent(
    query
  )}&c=1_2&f=0&${filters}&p=${page}`;
};

/**
 * Parse XML RSS response and extract torrent items
 * Uses regex-based parsing for better Node.js compatibility
 */
export const parseNyaaRSS = (xmlText: string): NyaaEpisode[] => {
  const episodes: NyaaEpisode[] = [];
  
  try {
    // Extract all <item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
      const itemContent = itemMatch[1];
      
      // Extract data using helper function
      const title = extractXMLTag(itemContent, "title");
      const torrentLink = extractXMLTag(itemContent, "link");
      const guid = extractXMLTag(itemContent, "guid");
      const pubDate = extractXMLTag(itemContent, "pubDate");
      
      // Extract nyaa-specific namespaced data
      const seeders = parseInt(extractXMLTag(itemContent, "nyaa:seeders") || "0");
      const leechers = parseInt(extractXMLTag(itemContent, "nyaa:leechers") || "0");
      const size = extractXMLTag(itemContent, "nyaa:size") || "";
      const infoHash = extractXMLTag(itemContent, "nyaa:infoHash") || "";
      
      // Create magnet link from info hash
      const magnet = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(title)}&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://tracker.torrent.eu.org:451/announce`;
      
      // Format date to match the HTML scrapper format
      const formattedDate = formatNyaaDate(pubDate);
      
      episodes.push({
        title,
        magnet,
        torrentFile: torrentLink,
        size,
        seeders,
        leechers,
        date: formattedDate,
        url: guid,
      });
    }
    
    return episodes;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return [];
  }
};

/**
 * Extract content from XML tag using regex
 */
const extractXMLTag = (xmlContent: string, tagName: string): string => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xmlContent.match(regex);
  return match ? match[1].trim() : "";
};

/**
 * Format RSS pubDate to match Nyaa HTML format
 * Input: "Tue, 28 Jan 2025 18:41:02 -0000"
 * Output: "2025-01-28 18:41"
 */
const formatNyaaDate = (pubDate: string): string => {
  try {
    const date = new Date(pubDate);
    if (isNaN(date.getTime())) {
      return pubDate; // Return original if parsing fails
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.warn("Failed to format date:", pubDate, error);
    return pubDate;
  }
};

/**
 * Extract episode number from title for sorting
 * Handles various formats like "- 01", "Episode 1", "EP01", etc.
 */
const extractEpisodeNumber = (title: string): number => {
  // Common patterns for episode numbers
  const patterns = [
    /(?:Episode|EP|E)\s*(\d+)/i,
    /\s-\s(\d+)\s/,
    /\[(\d+)\]/,
    /(?:第|#)(\d+)(?:話|回)?/,
    /\s(\d+)(?:v\d+)?\s*(?:\[|\(|$)/,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  // Fallback: look for any number that might be an episode
  const numberMatch = title.match(/\b(\d{1,3})\b/);
  return numberMatch ? parseInt(numberMatch[1], 10) : 0;
};

/**
 * Sort episodes by episode number, then by seeders
 */
const sortEpisodes = (episodes: NyaaEpisode[]): NyaaEpisode[] => {
  return episodes.sort((a, b) => {
    const episodeA = extractEpisodeNumber(a.title);
    const episodeB = extractEpisodeNumber(b.title);

    // First sort by episode number (descending)
    if (episodeA !== episodeB) {
      return episodeB - episodeA;
    }
    
    // If episode numbers are the same, sort by seeders (descending)
    return b.seeders - a.seeders;
  });
};

/**
 * Fetch and parse episodes from Nyaa RSS feed
 */
export const fetchNyaaEpisodes = async (query: string, filters = "", maxPages = 3): Promise<NyaaEpisode[]> => {
  let allEpisodes: NyaaEpisode[] = [];
  
  try {
    for (let page = 1; page <= maxPages; page++) {
      const rssUrl = getNyaaRSSUrl(query, filters, page);
      
      const response = await fetch(rssUrl, { cache: "no-store" });
      const xmlText = await response.text();
      
      const episodes = parseNyaaRSS(xmlText);
      allEpisodes = [...allEpisodes, ...episodes];
      
      // If we got fewer than 75 results, we've reached the end
      if (episodes.length < 75) {
        break;
      }
    }
    
    return allEpisodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    throw error;
  }
};

/**
 * Get anime episodes by releasers using XML RSS
 */
export const getAnimeEpisodesByReleasersXML = async ({
  animeName,
  releasers,
  searchTermsList,
}: {
  animeName: {
    english: string;
    japanese: string;
  };
  releasers: string[];
  searchTermsList: string[];
}) => {
  try {
    const maxPages = 3;
    const shapedEnglishName = animeNameShaper(animeName.english);
    const shapedJapaneseName = animeNameShaper(animeName.japanese);

    const combinedQuery = buildSearchQueryXML({
      releasers,
      animeName: { english: shapedEnglishName, japanese: shapedJapaneseName },
      searchTerms: searchTermsList,
    });

    const allEpisodes = await fetchNyaaEpisodes(combinedQuery, "s=id&o=desc", maxPages);

    // Group episodes by releaser
    const episodesByReleaser: { [key: string]: NyaaEpisode[] } = {};

    allEpisodes.forEach((episode) => {
      const releaser = releasers.find((rel) =>
        episode.title.toLowerCase().includes(rel.toLowerCase())
      );

      if (releaser) {
        if (!episodesByReleaser[releaser]) {
          episodesByReleaser[releaser] = [];
        }
        episodesByReleaser[releaser].push(episode);
      }
    });

    // Sort episodes within each releaser group by episode number, then by seeders
    Object.keys(episodesByReleaser).forEach((releaser) => {
      episodesByReleaser[releaser] = sortEpisodes(episodesByReleaser[releaser]);
    });

    return episodesByReleaser;
  } catch (error) {
    console.error("Error fetching episodes by releasers (XML):", error);
    throw error;
  }
};

/**
 * Get anime batches using XML RSS
 */
export const getAnimeBatchesXML = async ({
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
    const queries = [
      `${shapedAnimeTitle} BD`,
      `${shapedAnimeTitle} Batch`,
      `${shapedAnimeTitleJapanese} BD`,
      `${shapedAnimeTitleJapanese} Batch`,
    ];

    // Fetch all queries in parallel
    const episodePromises = queries.map((query) => 
      fetchNyaaEpisodes(query, "s=seeders&o=desc", 1)
    );

    const episodeArrays = await Promise.all(episodePromises);
    
    // Flatten and deduplicate
    const allEpisodes = episodeArrays.flat();
    const uniqueEpisodes = Array.from(
      new Map(allEpisodes.map(ep => [ep.url, ep])).values()
    );

    // Filter for active torrents (seeders > 0) and sort by seeders
    return uniqueEpisodes
      .filter(ep => ep.seeders > 0)
      .sort((a, b) => b.seeders - a.seeders);
      
  } catch (error) {
    console.error("Error fetching batches (XML):", error);
    throw error;
  }
};

/**
 * Build search query for XML RSS endpoint
 */
interface AnimeName {
  english: string;
  japanese: string;
}

interface SearchQueryBuilderParams {
  releasers: string[];
  animeName: AnimeName;
  searchTerms?: string[];
}

const buildSearchQueryXML = ({
  releasers,
  animeName,
  searchTerms = [],
}: SearchQueryBuilderParams): string => {
  const shapedEnglishName = animeNameShaper(animeName.english);
  const shapedJapaneseName = animeNameShaper(animeName.japanese);

  const releaserPattern = `(${releasers.join("|")})`;

  if (searchTerms.length === 0) {
    // Use original logic with English and Japanese names
    return `( ${releaserPattern} ${shapedEnglishName} )| ( ${releaserPattern} ${shapedJapaneseName} )`;
  } else {
    // Use searchTerms instead of English/Japanese names
    return searchTerms
      .map((term: string) => `( ${releaserPattern} ${term} )`)
      .join(" | ");
  }
};
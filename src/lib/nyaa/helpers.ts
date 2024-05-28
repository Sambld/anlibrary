import * as cheerio from "cheerio";
import { NyaaEpisode } from "./types";

export const getSearchResultCount = ($: cheerio.CheerioAPI) => {
  const resultCount = $(".pagination-page-info").text();
  const regex = /\b(?<start>\d+)-(?<end>\d+) out of (?<total>\d+)\b/;
  const match = resultCount.match(regex);
  if (match) {
    const { start, end, total } = match.groups as { [key: string]: string };
    return {
      start: parseInt(start),
      end: parseInt(end),
      total: parseInt(total),
    };
  } else {
    return { start: 0, end: 0, total: 0 };
  }
};

export const getEpisodes = ($: cheerio.CheerioAPI): NyaaEpisode[] => {
  const items = $(".torrent-list tbody tr");
  const result: NyaaEpisode[] = [];

  items.each((index, element) => {
    const item = $(element);
    const titleCol = item.find("td:nth-child(2) a");
    const title = titleCol.eq(1).text().trim() || titleCol.eq(0).text().trim();
    const magnet =
      item.find('td:nth-child(3) a[href^="magnet:?"]').attr("href") || "";
    const torrentFile =
      item.find('td:nth-child(3) a[href$=".torrent"]').attr("href") || "";
    const size = item.find("td:nth-child(4)").text().trim();
    const date = item.find("td:nth-child(5)").text() || "";
    const seeders = parseInt(item.find("td:nth-child(6)").text().trim(), 10);
    const leechers = parseInt(item.find("td:nth-child(7)").text().trim(), 10);

    result.push({
      title,
      magnet,
      torrentFile,
      size,
      date,
      seeders,
      leechers,
    });
  });

  return result;
};

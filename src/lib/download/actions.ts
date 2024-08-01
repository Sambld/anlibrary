"use server";

import { db } from "@/db";
import { library } from "@/db/schema";
import { eq } from "drizzle-orm";
import { existsSync, mkdirSync } from "fs";
import { exec } from "child_process";
import { getFullAnimeById } from "../jikan_api/api";
import * as cheerio from "cheerio";

export const isValidPath = (path: string) => {
  // check if the path is valid on the file system
  try {
    const normalizedPath = path.replace(/\\/g, "/");
    const isValid = existsSync(normalizedPath);
    return isValid;
  } catch (error) {
    console.error("Error checking path validity:", error);
    return false;
  }
};

export const openFolder = async (id: number) => {
  const anime = await db
    .select()
    .from(library)
    .where(eq(library.animeId, id))
    .execute();
  if (anime.length === 0) {
    return { message: "Anime not found" };
  }
  let title = anime[0].title;
  title = sanitizeFolderName(title);
  const fullPath = `${process.env.BASE_DOWNLOAD_PATH}${title}`.replace(
    /\//g,
    "\\"
  );
  exec(`start explorer.exe "${fullPath}"`);
};

export const downloadSubtitles = async (subtitlesLink: string) => {
  try {
    if (!subtitlesLink.endsWith("/arabic")) {
      if (subtitlesLink.endsWith("/")) {
        subtitlesLink = subtitlesLink + "arabic";
      } else {
        subtitlesLink = subtitlesLink + "/arabic";
      }
    }
    // console.log("Downloading subtitles from:", subtitlesLink);
    const subtitlePage = await fetch(subtitlesLink);
    const subtitleHtml = await subtitlePage.text();
    const $ = cheerio.load(subtitleHtml);
    const downloadLinks = $("a").map((index, element) => {
      const $element = $(element);
      const href = $element.attr("href");
      const isDownload = $element.attr("data-umami-event");
      if (
        href?.startsWith("https://dl.subdl.com/") &&
        isDownload === "download"
      ) {
        return href;
      }
    });

    // download the last link
    return downloadLinks[downloadLinks.length - 1];
    const lastLink = downloadLinks[downloadLinks.length - 1];
    if (lastLink) {
    }
    // console.log(downloadLinks);
  } catch (error) {
    console.error("Error downloading subtitles:", error);
  }
};

export const handleDaySelection = async (day: string, animeId: number) => {
  const anime = await db
    .update(library)
    .set({ broadcastDay: day })
    .where(eq(library.animeId, animeId))
    .execute();

  if (anime.changes === 0) {
    return {
      code: 404,
      message: `Anime not in library `,
    };
  }

  return {
    code: 200,
    message: `updated broadcast day to ${day}`,
  };
};

type AddTorrentParams = {
  animeId: number;
  magnetUrl: string;
  downloadSpeed?: number;
  category?: string;
};

export async function addTorrent({
  magnetUrl,
  downloadSpeed,
  animeId,
}: AddTorrentParams): Promise<{ success: boolean; message: string }> {
  const qbittorrentUrl = process.env.QBITTORRENT_URL;

  if (!qbittorrentUrl) {
    throw new Error("QBITTORRENT_URL is not set in environment variables");
  }

  if (!magnetUrl.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i)) {
    return {
      success: false,
      message: "Magnet URI not valid",
    };
  }

  const anime = await db
    .select()
    .from(library)
    .where(eq(library.animeId, animeId))
    .execute();

  if (anime.length === 0) {
    return {
      success: false,
      message: `Anime not in library `,
    };
  }

  let { title } = anime[0];
  title = sanitizeFolderName(title);
  const animeSavePath = `${process.env.BASE_DOWNLOAD_PATH}${title}`;

  if (!existsSync(animeSavePath)) {
    mkdirSync(animeSavePath);
  }

  const formData = new FormData();
  formData.append("urls", magnetUrl);
  formData.append("firstLastPiecePrio", "true");
  formData.append("sequentialDownload", "true");
  formData.append("savepath", animeSavePath);

  if (downloadSpeed !== 0 && downloadSpeed !== undefined) {
    formData.append("dlLimit", downloadSpeed.toString());
  }

  // fix qbittorrent adding -----------------------------XXXXXXXXX on last formData item by adding test field
  formData.append("test", "test");

  // log the form data to the console for debugging purposes
  const addTorrentResponse = await fetch(
    `${qbittorrentUrl}/api/v2/torrents/add`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!addTorrentResponse.ok) {
    throw new Error("Failed to add torrent");
  }

  return { success: true, message: "Torrent added successfully" };
}

const sanitizeFolderName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9\s\-_]/g, "");
};

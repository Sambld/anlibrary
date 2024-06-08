"use server";

import { db } from "@/db";
import { library } from "@/db/schema";
import { eq } from "drizzle-orm";
import { existsSync, mkdirSync } from "fs";
import { exec } from "child_process";
import { getFullAnimeById } from "../jikan_api/api";
import * as cheerio from "cheerio";

type SpawnDownloadProps = {
  animeId: number;
  magnet: string;
};
export const spawnDownload = async ({
  animeId,
  magnet,
}: SpawnDownloadProps) => {
  // Sanitize animeId
  const sanitizedAnimeId = animeId.toString().replaceAll(/[^a-zA-Z0-9]/g, "");

  // Sanitize magnet link
  const sanitizedMagnet = magnet.replaceAll(/[^a-zA-Z0-9:?=\/&-]/g, "");

  const anime = await db
    .select()
    .from(library)
    .where(eq(library.animeId, parseInt(sanitizedAnimeId)))
    .execute();

  if (anime.length === 0) {
    const fetchedAnime = await getFullAnimeById(sanitizedAnimeId);
    const { title } = fetchedAnime.data;

    // Sanitize title
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, "");

    return spawnAria2c(sanitizedMagnet, sanitizedTitle);
  } else {
    const animeEntry = anime[0];

    // Sanitize title
    const sanitizedTitle = animeEntry.title.replace(/[^a-zA-Z0-9\s\-_]/g, "");

    return spawnAria2c(sanitizedMagnet, sanitizedTitle);
  }
};

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

export const openFolder = async (animeTitle: string) => {
  const sanitizedTitle = animeTitle.replace(/[^a-zA-Z0-9\s\-_]/g, "");
  const fullPath = `${process.env.BASE_DOWNLOAD_PATH}${sanitizedTitle}`.replace(
    /\//g,
    "\\"
  );
  exec(`start explorer.exe "${fullPath}"`);
};

const spawnAria2c = async (magnet: string, animeTitle: string) => {
  try {
    if (!isValidPath(process.env.BASE_DOWNLOAD_PATH!)) {
      return { message: "Invalid download path" };
    }

    const fullAnimePath = `${process.env.BASE_DOWNLOAD_PATH}${animeTitle}`;

    if (!existsSync(fullAnimePath)) {
      mkdirSync(fullAnimePath);
    }

    exec(
      `start aria2c.exe -d "${fullAnimePath}" "${magnet}" --max-upload-limit=5K --seed-time=0 --bt-prioritize-piece=head=100M,tail=20M`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error}`);
          return;
        }
      }
    );

    return { message: "Download started" };
  } catch (error) {
    return { message: "Failed to spawn download " + error };
  }
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
    const lastLink = downloadLinks[downloadLinks.length - 1];
    if (lastLink) {
    }
    // console.log(downloadLinks);
  } catch (error) {
    console.error("Error downloading subtitles:", error);
  }
};

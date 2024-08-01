"use server";

import { db } from "@/db";
import { getFullAnimeById } from "../jikan_api/api";
import { library } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { convertToUTCTimeZone } from "../utils";
import { existsSync } from "fs";

type AddAnimeToLibraryProps = {
  animeId: number;
  folderPath?: string;
  subtitlesLink?: string;
};
export const toggleAnime = async ({
  animeId,
  subtitlesLink,
}: AddAnimeToLibraryProps) => {
  // this is fine since the request would be cached for 24 hours
  const anime = await getFullAnimeById(animeId.toString());
  try {
    const existingLibraryEntry = await db
      .select()
      .from(library)
      .where(and(eq(library.animeId, animeId)));

    if (existingLibraryEntry.length > 0) {
      await db.delete(library).where(and(eq(library.animeId, animeId)));

      revalidatePath("/library");
      return {
        message: "Anime removed from library",
        isInLibrary: false,
      };
    }

    const { day, time } = convertToUTCTimeZone({
      dayOfWeek: anime.data.broadcast.day!,
      time: anime.data.broadcast.time!,
    });

    // for rate limiting issues we store some of the anime data in the library table for quick access and to avoid hammering the jikan api
    await db.insert(library).values({
      animeId,
      image: anime.data.images.webp.image_url,
      title: anime.data.title,
      episodes: anime.data.episodes || 0,
      subtitlesLink: subtitlesLink || "",
      broadcastDay: day,
      broadcastTime: time,
      status: anime.data.status || "Unknown",
    });

    revalidatePath("/library");
    return {
      message: "Anime added to library",
      isInLibrary: true,
    };
  } catch (error) {
    return {
      error: "Failed to toggle anime",
    };
  }
};

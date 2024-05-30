"use server";

import { db } from "@/db";
import { validateRequest } from "../auth/lucia";
import { getFullAnimeById } from "../jikan_api/api";
import { library } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { convertToUTCTimeZone } from "../utils";

export const toggleAnime = async (animeId: number) => {
  // this is fine since the request would be cached for 24 hours
  const anime = await getFullAnimeById(animeId.toString());
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        error: "Unauthorized ! Please login to add anime to library",
      };
    }

    const existingLibraryEntry = await db
      .select()
      .from(library)
      .where(and(eq(library.animeId, animeId), eq(library.userId, user.id)));

    if (existingLibraryEntry.length > 0) {
      await db
        .delete(library)
        .where(and(eq(library.animeId, animeId), eq(library.userId, user.id)));

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
      userId: user.id,
      image: anime.data.images.webp.image_url,
      title: anime.data.title,
      episodes: anime.data.episodes || 0,
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
    console.log(error);

    return {
      error: "Failed to toggle anime",
    };
  }
};

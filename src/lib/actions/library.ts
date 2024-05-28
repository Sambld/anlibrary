"use server";
import { db } from "@/db";
import { validateRequest } from "../auth/lucia";
import { library } from "@/db/schema";
import { and, eq, is } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const toggleAnime = async (animeId: number) => {
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
      revalidatePath(`/anime/${animeId}`);
      return {
        message: "Anime removed from library",
      };
    }

    await db.insert(library).values({
      animeId,
      userId: user.id,
    });

    revalidatePath(`/anime/${animeId}`);

    return {
      message: "Anime added to library",
    };
  } catch (error) {
    return {
      error: "Failed to toggle anime",
    };
  }
};

export const getLibrary = async () => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      redirect("/login");
    }

    const libraryEntries = await db
      .select()
      .from(library)
      .where(eq(library.userId, user.id))
      .execute();

    return {
      library: libraryEntries,
    };
  } catch (error) {
    return {
      error: "Failed to fetch library",
    };
  }
};

export const isAnimeInLibrary = async (animeId: number) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        isInLibrary: false,
      };
    }

    const existingLibraryEntry = await db
      .select()
      .from(library)
      .where(and(eq(library.animeId, animeId), eq(library.userId, user.id)));

    return {
      isInLibrary: existingLibraryEntry.length > 0,
    };
  } catch (error) {
    return {
      error: "Failed to check library",
    };
  }
};

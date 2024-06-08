import { db } from "@/db";
import { library } from "@/db/schema";
import { and, eq, is } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
export const getLibrary = async () => {
  try {
    // if (!user) {
    //   redirect("/?error=Unauthorized");
    // }

    const libraryEntries = await db.select().from(library).execute();

    return {
      library: libraryEntries,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    notFound();
  }
};

export const isAnimeInLibrary = async (animeId: number) => {
  try {
    const existingLibraryEntry = await db
      .select()
      .from(library)
      .where(and(eq(library.animeId, animeId)));

    return {
      isInLibrary: existingLibraryEntry.length > 0,
    };
  } catch (error) {
    return {
      error: "Failed to check library",
    };
  }
};

export const getAnimeFromLibrary = async (animeId: number) => {
  try {
    const existingLibraryEntry = await db
      .select()
      .from(library)
      .where(and(eq(library.animeId, animeId)));

    if (existingLibraryEntry.length > 0) {
      return {
        anime: existingLibraryEntry[0],
      };
    }
    return null;
  } catch (error) {
    return {
      error: "Failed to check library",
    };
  }
};

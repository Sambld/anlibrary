import { Search } from "lucide-react";
import { InferModel, InferSelectModel, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// library table
export const library = sqliteTable("library", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animeId: integer("anime_id").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  episodes: integer("episodes").notNull(),
  subtitlesLink: text("subtitle_urls").notNull(),
  broadcastDay: text("broadcast_day").notNull(),
  broadcastTime: text("broadcast_time").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
export type LibraryType = InferSelectModel<typeof library>;

export const search_names = sqliteTable("search_names", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  anime_id: integer("anime_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type SearchTermType = InferSelectModel<typeof search_names>;

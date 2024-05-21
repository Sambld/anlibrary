import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// Anime table
export const animes = sqliteTable("animes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  malId: integer("mal_id").notNull(),
  releaseDay: text("release_day").notNull(),
  active: integer("active").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Anime Configurations table
export const animeConfigs = sqliteTable("anime_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animeId: integer("anime_id")
    .references(() => animes.id)
    .notNull(),
  folderPath: text("folder_path").notNull(),
  subtitleUrls: text("subtitle_urls").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

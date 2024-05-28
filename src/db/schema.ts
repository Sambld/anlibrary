import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// Anime table

// Anime Configurations table
export const animeConfigs = sqliteTable("anime_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animeId: integer("anime_id").notNull(),
  folderPath: text("folder_path").notNull(),
  subtitleUrls: text("subtitle_urls").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// library table
export const library = sqliteTable("library", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animeId: integer("anime_id").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

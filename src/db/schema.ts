import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// Anime table

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

// import { sql } from "drizzle-orm";
// import { integer, serial, text } from "drizzle-orm/pg-core";
// import { pgTable, timestamp } from "drizzle-orm/pg-core";

// export const userTable = pgTable("user", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull(),
//   password: text("password").notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

// export const sessionTable = pgTable("session", {
//   id: text("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => userTable.id),
//   expiresAt: timestamp("expires_at", {
//     withTimezone: true,
//     mode: "date",
//   }).notNull(),
// });

// export const library = pgTable("library", {
//   id: serial("id").primaryKey(),
//   animeId: integer("anime_id").notNull(),
//   image: text("image").notNull(),
//   title: text("title").notNull(),
//   episodes: integer("episodes").notNull(),
//   broadcastDay: text("broadcast_day").notNull(),
//   broadcastTime: text("broadcast_time").notNull(),
//   status: text("status").notNull(),
//   userId: integer("user_id")
//     .references(() => userTable.id)
//     .notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).default(sql`CURRENT_TIMESTAMP`),
// });

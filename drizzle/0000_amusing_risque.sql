CREATE TABLE `library` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anime_id` integer NOT NULL,
	`image` text NOT NULL,
	`title` text NOT NULL,
	`episodes` integer NOT NULL,
	`subtitle_urls` text NOT NULL,
	`broadcast_day` text NOT NULL,
	`broadcast_time` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

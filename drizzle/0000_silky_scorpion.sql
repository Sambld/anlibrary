CREATE TABLE `anime_configs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anime_id` integer NOT NULL,
	`folder_path` text NOT NULL,
	`subtitle_urls` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `anime_download_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anime_id` integer NOT NULL,
	`episode_number` integer NOT NULL,
	`releaser` text NOT NULL,
	`encoding_type` text NOT NULL,
	`download_link` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `animes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`mal_id` integer NOT NULL,
	`release_day` text NOT NULL,
	`active` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

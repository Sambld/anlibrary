import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { closeSync, existsSync, mkdirSync, openSync } from "fs";
import { dirname, resolve } from "path";

const dbPath = resolve(process.cwd(), "database.db");

if (!existsSync(dirname(dbPath))) {
	mkdirSync(dirname(dbPath), { recursive: true });
}

if (!existsSync(dbPath)) {
	closeSync(openSync(dbPath, "w"));
}

const sqlite = new Database(dbPath);
export const db: BetterSQLite3Database = drizzle(sqlite);

// Apply all pending migrations automatically on startup.
migrate(db, { migrationsFolder: "drizzle" });

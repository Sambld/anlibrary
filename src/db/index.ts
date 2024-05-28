import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, users } from "./schema";
const sqlite = new Database("database.db");
export const db: BetterSQLite3Database = drizzle(sqlite);

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users);

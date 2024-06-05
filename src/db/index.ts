// import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
// import Database from "better-sqlite3";
// import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
// import { sessionTable, users } from "./schema";
// const sqlite = new Database("database.db");
// export const db: BetterSQLite3Database = drizzle(sqlite);

// export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users);
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sessionTable, userTable } from "./schema";
const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(sql);

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable
);

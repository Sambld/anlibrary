import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://sam:ibLjBcXa2z9R@ep-hidden-dew-a22yrqr6.eu-central-1.aws.neon.tech/anlibrary?sslmode=require",
  },
});

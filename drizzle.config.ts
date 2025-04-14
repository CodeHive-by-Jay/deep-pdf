import type { Config } from "drizzle-kit";

export default {
    schema: "./src/lib/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.PGHOST!,
        database: process.env.PGDATABASE!,
        user: process.env.PGUSER!,
        password: process.env.PGPASSWORD!,
        ssl: process.env.PGSSL === "true", // Optional: Set based on your DB setup
    }
} satisfies Config;

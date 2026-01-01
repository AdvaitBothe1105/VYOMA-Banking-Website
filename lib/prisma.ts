// Load environment variables if not already loaded
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Lazy initialization to ensure env vars are loaded
function createPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  let poolConfig: any = {
    connectionString: databaseUrl,
  };

  // Supabase requires SSL connections
  try {
    const url = new URL(databaseUrl);
    if (url.hostname.includes("supabase.co")) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }
  } catch (e) {
    // If URL parsing fails, use connection string as-is (might be a connection pooler URL)
    // SSL will be handled by the connection string parameters
  }

  return new Pool(poolConfig);
}

const pool = createPool();
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

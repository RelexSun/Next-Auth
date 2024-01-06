import { PrismaClient } from "@prisma/client";

// DO ✅
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// TODO: whenever we save a file nextjs will do a hot reload and it will create a new PrismaClient every time.

// Don't❌
// export const db = new PrismaClient()

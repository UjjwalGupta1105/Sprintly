import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}



//  This globalThis.prisma is the global variable that ensures that the prisma client
// instance is reused across hot reloads during developement. Without this each time 
// your application reloads & create a new Prisma client
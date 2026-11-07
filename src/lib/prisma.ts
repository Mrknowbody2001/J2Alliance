import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

const hasRequiredDelegates = (client: PrismaClient) =>
  Boolean((client as PrismaClient & { category?: unknown }).category) &&
  Boolean((client as PrismaClient & { subCategory?: unknown }).subCategory) &&
  Boolean((client as PrismaClient & { discount?: unknown }).discount);

const shouldReuseGlobalClient =
  globalForPrisma.prisma && hasRequiredDelegates(globalForPrisma.prisma);

let prismaClient: PrismaClient;

if (shouldReuseGlobalClient && globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma;
} else {
  prismaClient = createPrismaClient();
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

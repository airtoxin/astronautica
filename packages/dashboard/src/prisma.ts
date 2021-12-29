import { PrismaClient } from "@prisma/client";
import { DEV_MODE } from "./constants";

const prismaClientPropertyName = "__prevent-name-collision__prisma";
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

const getPrismaClient = () => {
  if (!DEV_MODE) {
    return new PrismaClient();
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient();
    }
    return newGlobalThis[prismaClientPropertyName];
  }
};
export const prisma = getPrismaClient();

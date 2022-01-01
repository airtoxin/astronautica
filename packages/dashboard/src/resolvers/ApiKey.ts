import {
  ApiKey as ApiKeyType,
  ApiKeyResolvers,
  ApiKeyStatus,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";

export const ApiKey: ApiKeyResolvers = {
  status: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);

    switch (apiKey.status) {
      case "ENABLE":
        return ApiKeyStatus.Enable;
      case "DISABLE":
        return ApiKeyStatus.Disable;
    }
  },
  description: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);
    return apiKey.description;
  },
  expiresAt: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);
    return apiKey.expiresAt?.toISOString() ?? null;
  },
  lastUsedAt: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);
    return apiKey.lastUsedAt?.toISOString() ?? null;
  },
  createdAt: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);
    return apiKey.createdAt.toISOString();
  },
  updatedAt: async (parent, args, context) => {
    const apiKey = await context.prisma.apiKey.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (apiKey == null)
      throw new UserInputError(`ApiKey not found for id:${parent.id}`);
    return apiKey.updatedAt.toISOString();
  },
};

export const emptyApiKey = (id: string): ApiKeyType => ({
  id,
  status: ApiKeyStatus.Enable,
  description: "",
  expiresAt: "",
  lastUsedAt: "",
  createdAt: "",
  updatedAt: "",
});

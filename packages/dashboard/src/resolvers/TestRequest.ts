import {
  TestRequest as TestRequestType,
  TestRequestResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";

export const TestRequest: TestRequestResolvers = {
  name: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return testRequest.name;
  },
  request: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return JSON.stringify(testRequest.request);
  },
  response: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return JSON.stringify(testRequest.response);
  },
  createdAt: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return testRequest.createdAt.toISOString();
  },
  updatedAt: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return testRequest.updatedAt.toISOString();
  },
};

export const emptyTestRequest = (id: string): TestRequestType => ({
  id,
  name: "",
  request: "",
  response: "",
  createdAt: "",
  updatedAt: "",
});

import {
  TestFile as TestFileType,
  TestFileResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyTestRequest } from "./TestRequest";

export const TestFile: TestFileResolvers = {
  path: async (parent, args, context) => {
    const testFile = await context.prisma.testFile.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testFile == null)
      throw new UserInputError(`testFile not found for id:${parent.id}`);
    return testFile.path;
  },
  createdAt: async (parent, args, context) => {
    const testFile = await context.prisma.testFile.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testFile == null)
      throw new UserInputError(`testFile not found for id:${parent.id}`);
    return testFile.createdAt.toISOString();
  },
  updatedAt: async (parent, args, context) => {
    const testFile = await context.prisma.testFile.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testFile == null)
      throw new UserInputError(`testFile not found for id:${parent.id}`);
    return testFile.updatedAt.toISOString();
  },
  testRequests: async (parent, args, context) => {
    const testFile = await context.prisma.testFile.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        testRequests: {
          select: {
            id: true,
          },
        },
      },
    });
    if (testFile == null)
      throw new UserInputError(`testFile not found for id:${parent.id}`);
    return testFile.testRequests.map(({ id }) => emptyTestRequest(id));
  },
};

export const emptyTestFile = (id: string): TestFileType => ({
  id,
  path: "",
  createdAt: "",
  updatedAt: "",
  testRequests: [],
});

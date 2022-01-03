import {
  Project,
  TestFile as TestFileType,
  TestFileResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyTestRequest } from "./TestRequest";
import { emptyProject } from "./Project";
import { emptyOrganization } from "./Organization";

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
        project: {
          select: {
            organizationId: true,
          },
        },
      },
    });
    if (testFile == null)
      throw new UserInputError(`testFile not found for id:${parent.id}`);
    return testFile.testRequests.map(({ id }) =>
      emptyTestRequest(
        id,
        emptyTestFile(
          parent.id,
          emptyProject(
            testFile.projectId,
            emptyOrganization(testFile.project.organizationId)
          )
        )
      )
    );
  },
};

export const emptyTestFile = (id: string, project: Project): TestFileType => ({
  id,
  path: "",
  createdAt: "",
  updatedAt: "",
  testRequests: [],
  project,
});

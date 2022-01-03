import {
  TestFile,
  TestRequest as TestRequestType,
  TestRequestResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyRequestData } from "./RequestData";
import { emptyTestFile } from "./TestFile";
import { emptyProject } from "./Project";
import { emptyOrganization } from "./Organization";
import { emptyPreRequestData } from "./PreRequestData";
import { emptyResponseData } from "./ResponseData";

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
  preRequest: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        preRequest: true,
        testFile: {
          include: {
            project: true,
          },
        },
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    if (testRequest.preRequest == null)
      throw new UserInputError(`preRequest not found for id:${parent.id}`);
    return emptyPreRequestData(
      testRequest.preRequest.id,
      emptyTestRequest(
        parent.id,
        emptyTestFile(
          testRequest.testFile.id,
          emptyProject(
            testRequest.testFile.projectId,
            emptyOrganization(testRequest.testFile.project.organizationId)
          )
        )
      )
    );
  },
  preRequestCallback: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return testRequest.preRequestCallback;
  },
  request: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        request: true,
        testFile: {
          include: {
            project: true,
          },
        },
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    if (testRequest.request == null)
      throw new UserInputError(`request not found for id:${parent.id}`);
    return emptyRequestData(
      testRequest.request.id,
      emptyTestRequest(
        testRequest.id,
        emptyTestFile(
          testRequest.testFileId,
          emptyProject(
            testRequest.testFile.projectId,
            emptyOrganization(testRequest.testFile.project.organizationId)
          )
        )
      )
    );
  },
  response: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        response: true,
        testFile: {
          include: {
            project: true,
          },
        },
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    if (testRequest.response == null)
      throw new UserInputError(`response not found for id:${parent.id}`);
    return emptyResponseData(
      testRequest.response.id,
      emptyTestRequest(
        parent.id,
        emptyTestFile(
          testRequest.testFileId,
          emptyProject(
            testRequest.testFile.projectId,
            emptyOrganization(testRequest.testFile.project.organizationId)
          )
        )
      )
    );
  },
  testCallback: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return testRequest.testCallback;
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
  testFile: async (parent, args, context) => {
    const testRequest = await context.prisma.testRequest.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        testFile: {
          include: {
            project: true,
          },
        },
      },
    });
    if (testRequest == null)
      throw new UserInputError(`testRequest not found for id:${parent.id}`);
    return emptyTestFile(
      testRequest.testFileId,
      emptyProject(
        testRequest.testFile.projectId,
        emptyOrganization(testRequest.testFile.project.organizationId)
      )
    );
  },
};

export const emptyTestRequest = (
  id: string,
  testFile: TestFile
): TestRequestType => ({
  id,
  name: "",
  createdAt: "",
  updatedAt: "",
  testFile,
});

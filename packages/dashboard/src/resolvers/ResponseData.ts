import {
  ResponseData as ResponseDataType,
  ResponseDataResolvers,
  TestRequest,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyTestRequest } from "./TestRequest";
import { emptyTestFile } from "./TestFile";
import { emptyProject } from "./Project";
import { emptyOrganization } from "./Organization";

export const ResponseData: ResponseDataResolvers = {
  url: async (parent, args, context) => {
    const responseData = await context.prisma.responseData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (responseData == null)
      throw new UserInputError(`responseData not found for id:${parent.id}`);
    return responseData.url;
  },
  body: async (parent, args, context) => {
    const responseData = await context.prisma.responseData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (responseData == null)
      throw new UserInputError(`responseData not found for id:${parent.id}`);
    return responseData.body;
  },
  status: async (parent, args, context) => {
    const responseData = await context.prisma.responseData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (responseData == null)
      throw new UserInputError(`responseData not found for id:${parent.id}`);
    return responseData.status;
  },
  headers: async (parent, args, context) => {
    const responseData = await context.prisma.responseData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (responseData == null)
      throw new UserInputError(`responseData not found for id:${parent.id}`);
    return responseData.headers;
  },
  testRequest: async (parent, args, context) => {
    const responseData = await context.prisma.responseData.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        testRequest: {
          include: {
            testFile: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });
    if (responseData == null)
      throw new UserInputError(`responseData not found for id:${parent.id}`);
    return emptyTestRequest(
      responseData.testRequestId,
      emptyTestFile(
        responseData.testRequest.testFileId,
        emptyProject(
          responseData.testRequest.testFile.projectId,
          emptyOrganization(
            responseData.testRequest.testFile.project.organizationId
          )
        )
      )
    );
  },
};

export const emptyResponseData = (
  id: string,
  testRequest: TestRequest
): ResponseDataType => ({
  id,
  url: "",
  status: 0,
  headers: {},
  testRequest,
});

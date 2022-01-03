import {
  RequestData as RequestDataType,
  RequestDataResolvers,
  TestRequest,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyTestRequest } from "./TestRequest";
import { emptyTestFile } from "./TestFile";
import { emptyProject } from "./Project";
import { emptyOrganization } from "./Organization";

export const RequestData: RequestDataResolvers = {
  url: async (parent, args, context) => {
    const requestData = await context.prisma.requestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (requestData == null)
      throw new UserInputError(`requestData not found for id:${parent.id}`);
    return requestData.url;
  },
  method: async (parent, args, context) => {
    const requestData = await context.prisma.requestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (requestData == null)
      throw new UserInputError(`requestData not found for id:${parent.id}`);
    return requestData.method;
  },
  headers: async (parent, args, context) => {
    const requestData = await context.prisma.requestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (requestData == null)
      throw new UserInputError(`requestData not found for id:${parent.id}`);
    return requestData.headers;
  },
  testRequest: async (parent, args, context) => {
    const requestData = await context.prisma.requestData.findUnique({
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
    if (requestData == null)
      throw new UserInputError(`requestData not found for id:${parent.id}`);
    return emptyTestRequest(
      requestData.testRequestId,
      emptyTestFile(
        requestData.testRequest.testFileId,
        emptyProject(
          requestData.testRequest.testFile.projectId,
          emptyOrganization(
            requestData.testRequest.testFile.project.organizationId
          )
        )
      )
    );
  },
};

export const emptyRequestData = (
  id: string,
  testRequest: TestRequest
): RequestDataType => ({
  id,
  url: "",
  method: "",
  headers: {},
  testRequest,
});

import {
  PreRequestData as PreRequestDataType,
  PreRequestDataResolvers,
  TestRequest,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyTestRequest } from "./TestRequest";
import { emptyTestFile } from "./TestFile";
import { emptyProject } from "./Project";
import { emptyOrganization } from "./Organization";

export const PreRequestData: PreRequestDataResolvers = {
  url: async (parent, args, context) => {
    const preRequestData = await context.prisma.preRequestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (preRequestData == null)
      throw new UserInputError(`preRequestData not found for id:${parent.id}`);
    return preRequestData.url;
  },
  method: async (parent, args, context) => {
    const preRequestData = await context.prisma.preRequestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (preRequestData == null)
      throw new UserInputError(`preRequestData not found for id:${parent.id}`);
    return preRequestData.method;
  },
  headers: async (parent, args, context) => {
    const preRequestData = await context.prisma.preRequestData.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (preRequestData == null)
      throw new UserInputError(`preRequestData not found for id:${parent.id}`);
    return preRequestData.headers;
  },
  testRequest: async (parent, args, context) => {
    const preRequestData = await context.prisma.preRequestData.findUnique({
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
    if (preRequestData == null)
      throw new UserInputError(`preRequestData not found for id:${parent.id}`);
    return emptyTestRequest(
      preRequestData.testRequestId,
      emptyTestFile(
        preRequestData.testRequest.testFileId,
        emptyProject(
          preRequestData.testRequest.testFile.projectId,
          emptyOrganization(
            preRequestData.testRequest.testFile.project.organizationId
          )
        )
      )
    );
  },
};

export const emptyPreRequestData = (
  id: string,
  testRequest: TestRequest
): PreRequestDataType => ({
  id,
  url: "",
  method: "",
  headers: {},
  testRequest,
});

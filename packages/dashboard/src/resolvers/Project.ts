import {
  Organization,
  Project as ProjectType,
  ProjectResolvers,
} from "../graphql-types.gen";
import { emptyOrganization } from "./Organization";
import { UserInputError } from "apollo-server-micro";
import { emptyApiKey } from "./ApiKey";
import { emptyTestFile } from "./TestFile";

export const Project: ProjectResolvers = {
  name: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return project.name;
  },
  createdAt: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return project.createdAt.toISOString();
  },
  updatedAt: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return project.updatedAt.toISOString();
  },
  apiKeys: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        apiKeys: true,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return project.apiKeys.map(({ id }) => emptyApiKey(id));
  },
  testFiles: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        testFiles: true,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return project.testFiles.map(({ id }) =>
      emptyTestFile(
        id,
        emptyProject(parent.id, emptyOrganization(project.organizationId))
      )
    );
  },
  organization: async (parent, args, context) => {
    const project = await context.prisma.project.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (project == null)
      throw new UserInputError(`Project not found for id:${parent.id}`);
    return emptyOrganization(project.organizationId);
  },
};

export const emptyProject = (
  projectId: string,
  organization: Organization
): ProjectType => ({
  id: projectId,
  name: "",
  createdAt: "",
  updatedAt: "",
  apiKeys: [],
  testFiles: [],
  organization,
});

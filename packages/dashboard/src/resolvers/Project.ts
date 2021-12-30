import { Project as ProjectType } from "../graphql-types.gen";

export const emptyProject = (projectId: string): ProjectType => ({
  id: projectId,
  name: "",
  createdAt: "",
  updatedAt: "",
  apiKeys: [],
  testFiles: [],
});

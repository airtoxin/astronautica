import { Project as ProjectType } from "../graphql-types.gen";
import { emptyOrganization } from "./Organization";

export const emptyProject = (
  projectId: string,
  organizationId: string
): ProjectType => ({
  id: projectId,
  name: "",
  createdAt: "",
  updatedAt: "",
  apiKeys: [],
  testFiles: [],
  organization: emptyOrganization(organizationId),
});

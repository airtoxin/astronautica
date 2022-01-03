import {
  Organization as OrganizationType,
  OrganizationResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyAccount } from "./Account";
import { emptyProject } from "./Project";

export const Organization: OrganizationResolvers = {
  name: async (parent, args, context) => {
    const organization = await context.prisma.organization.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (organization == null)
      throw new UserInputError(`organization not found for id:${parent.id}`);
    return organization.name;
  },
  accounts: async (parent, args, context) => {
    const organization = await context.prisma.organization.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        accounts: {
          select: {
            id: true,
          },
        },
      },
    });
    if (organization == null)
      throw new UserInputError(`organization not found for id:${parent.id}`);
    return organization.accounts.map(({ id }) => emptyAccount(id));
  },
  projects: async (parent, args, context) => {
    const projects = await context.prisma.project.findMany({
      where: {
        organizationId: parent.id,
      },
      select: {
        id: true,
      },
    });
    return projects.map(({ id }) =>
      emptyProject(id, emptyOrganization(parent.id))
    );
  },
};

export const emptyOrganization = (id: string): OrganizationType => ({
  id,
  name: "",
  accounts: [],
  projects: [],
});

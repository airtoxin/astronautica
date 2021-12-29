import {
  Organization as OrganizationType,
  OrganizationResolvers,
} from "../graphql-types.gen";
import { UserInputError } from "apollo-server-micro";
import { emptyAccount } from "./Account";

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
};

export const emptyOrganization = (id: string): OrganizationType => ({
  id,
  name: "",
  accounts: [],
  projects: [],
});

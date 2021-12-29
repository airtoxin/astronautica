import { Account as AccountType, AccountResolvers } from "../graphql-types.gen";
import { emptyOrganization } from "./Organization";
import { UserInputError } from "apollo-server-micro";

export const Account: AccountResolvers = {
  email: async (parent, args, context) => {
    const account = await context.prisma.account.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (account == null)
      throw new UserInputError(`account not found for id:${parent.id}`);
    return account.email;
  },
  name: async (parent, args, context) => {
    const account = await context.prisma.account.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (account == null)
      throw new UserInputError(`account not found for id:${parent.id}`);
    return account.name;
  },
  createdAt: async (parent, args, context) => {
    const account = await context.prisma.account.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (account == null)
      throw new UserInputError(`account not found for id:${parent.id}`);
    return account.createdAt.toISOString();
  },
  updatedAt: async (parent, args, context) => {
    const account = await context.prisma.account.findUnique({
      where: {
        id: parent.id,
      },
    });
    if (account == null)
      throw new UserInputError(`account not found for id:${parent.id}`);
    return account.updatedAt.toISOString();
  },
  organizations: async (parent, args, context) => {
    const account = await context.prisma.account.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        organizations: {
          select: {
            id: true,
          },
        },
      },
    });
    if (account == null)
      throw new UserInputError(`account not found for id:${parent.id}`);
    return account.organizations.map(({ id }) => emptyOrganization(id));
  },
};

export const emptyAccount = (id: string): AccountType => ({
  id,
  email: "",
  name: "",
  createdAt: "",
  updatedAt: "",
  organizations: [],
});

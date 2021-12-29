import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    name: String!
    createdAt(format: String!): String!
    updatedAt(format: String!): String!
    organizations: [Organization!]!
  }

  type Organization {
    id: ID!
    name: String!
    accounts: [Account!]!
    projects: [Project!]!
  }

  type Project {
    id: ID!
    name: String!
    createdAt(format: String!): String!
    updatedAt(format: String!): String!
    apiKeys: [ApiKey!]!
    testFiles: [TestFile!]!
  }

  enum ApiKeyStatus {
    Enable
    Disable
  }

  type ApiKey {
    id: ID!
    status: ApiKeyStatus!
    description: String
    expiresAt(format: String!): String!
    lastUsedAt(format: String!): String!
    createdAt(format: String!): String!
    updatedAt(format: String!): String!
  }

  type TestFile {
    id: ID!
    path: String!
    createdAt(format: String!): String!
    updatedAt(format: String!): String!
    testRequests: [TestRequest!]!
  }

  type TestRequest {
    id: ID!
    name: String!
    preRequest: String
    preRequestCallback: String
    request: String!
    response: String!
    testCallback: String
    createdAt(format: String!): String!
    updatedAt(format: String!): String!
  }

  type Query {
    viewer: Account!
  }
`;

import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
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
    createdAt: String!
    updatedAt: String!
    apiKeys: [ApiKey!]!
    testFiles: [TestFile!]!
    organization: Organization!
  }

  enum ApiKeyStatus {
    Enable
    Disable
  }

  type ApiKey {
    id: ID!
    status: ApiKeyStatus!
    description: String
    expiresAt: String
    lastUsedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type TestFile {
    id: ID!
    path: String!
    createdAt: String!
    updatedAt: String!
    testRequests: [TestRequest!]!
    project: Project!
  }

  type TestRequest {
    id: ID!
    name: String!
    preRequest: String
    preRequestCallback: String
    request: String!
    response: String!
    testCallback: String
    createdAt: String!
    updatedAt: String!
    testFile: TestFile!
  }

  type Query {
    viewer: Account!
    organization(organizationId: String!): Organization!
    organizations: [Organization!]!
    project(projectId: String!): Project!
    projects(organizationId: String): [Project!]!
    testFile(testFileId: String!): TestFile!
    testRequest(testRequestId: String!): TestRequest!
  }

  type Mutation {
    login(idToken: String!): Boolean
    createProject(
      organizationId: String!
      projectName: String!
      apiKeyDescription: String
      apiKeyExpiration: String
    ): Project!
    addTestRequest(
      testFilePath: String!
      requestName: String!
      preRequest: String
      preRequestCallback: String
      request: String!
      response: String!
      testCallback: String
    ): TestRequest!
  }
`;

import "./fetch-polyfill";
import { fetch, Request, RequestInfo, RequestInit, Response } from "undici";
import { format } from "prettier";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  AddTestRequestMutationVariables,
  TestRequest,
} from "./graphql-types.gen";

const AddTestRequestMutation = gql`
  mutation AddTestRequest(
    $testFilePath: String!
    $requestName: String!
    $preRequest: String
    $preRequestCallback: String
    $request: String!
    $response: String!
    $testCallback: String
  ) {
    addTestRequest(
      testFilePath: $testFilePath
      requestName: $requestName
      preRequest: $preRequest
      preRequestCallback: $preRequestCallback
      request: $request
      response: $response
      testCallback: $testCallback
    ) {
      id
    }
  }
`;

export const createRequester = (
  serverAddress: string,
  apiKey?: string
): ((input: RequestInfo, init?: RequestInit) => AstronauticaClient) => {
  return (input: RequestInfo, init?: RequestInit): AstronauticaClient => {
    return new AstronauticaClient(serverAddress, input, init, apiKey);
  };
};

class AstronauticaClient {
  private readonly client: ApolloClient<any>;
  private readonly req: Request;
  private preReq: Promise<Request> | undefined;
  private preReqCallback:
    | ((req: Request) => Request | Promise<Request>)
    | undefined;
  private testCallback: ((res: Response) => unknown) | undefined;

  constructor(
    serverAddress: string,
    private input: RequestInfo,
    private init?: RequestInit,
    apiKey?: string
  ) {
    const apiKeyDefined = apiKey ?? readApiKeyFromEnv();
    this.client = new ApolloClient({
      uri: serverAddress,
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${apiKeyDefined}`,
      },
    });
    this.req = new Request(input, init);
  }

  preRequest(callback: (req: Request) => Request | Promise<Request>): this {
    this.preReqCallback = callback;
    this.preReq = Promise.resolve(callback(this.req.clone()));
    return this;
  }

  test(callback: (res: Response) => unknown): this {
    this.testCallback = callback;
    return this;
  }

  async run(): Promise<Response> {
    return fetch(this.input, this.init).then(async (res) => {
      await this.testCallback?.(res.clone());
      await this.client.mutate<TestRequest, AddTestRequestMutationVariables>({
        mutation: AddTestRequestMutation,
        variables: await this.serialize(res.clone()),
      });
      return res;
    });
  }

  async serialize(res: Response): Promise<AddTestRequestMutationVariables> {
    const testState = expect.getState();
    return {
      testFilePath: testState.testPath,
      requestName: testState.currentTestName,
      preRequest:
        this.preReq == null ? undefined : serializeRequest(await this.preReq),
      preRequestCallback: serializeCallback(this.preReqCallback),
      request: serializeRequest(this.req),
      response: await serializeResponse(res),
      testCallback: serializeCallback(this.testCallback),
    };
  }
}

const readApiKeyFromEnv = (): string => {
  if (process.env.ASTRONAUTICA_API_KEY) return process.env.ASTRONAUTICA_API_KEY;
  // TODO: read from config file
  // TODO: read from package.json
  throw new Error(`API Key not found.`);
};

const serializeRequest = (req: Request): string =>
  JSON.stringify({
    method: req.method,
    url: req.url,
    headers: serializeHeaders(req.headers),
    body: req.body == null ? undefined : JSON.stringify(req.body),
  });

const serializeResponse = async (res: Response): Promise<string> =>
  JSON.stringify({
    url: res.url,
    status: res.status,
    body: await res.text(),
    headers: serializeHeaders(res.headers),
    redirected: res.redirected,
  });

const serializeHeaders = (headers: Headers): string => {
  const h: { [key: string]: string } = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });
  return JSON.stringify(h);
};

const serializeCallback = (
  callback: ((...args: any[]) => any) | undefined
): string | undefined =>
  callback == null
    ? undefined
    : format(callback.toString(), { parser: "babel" });

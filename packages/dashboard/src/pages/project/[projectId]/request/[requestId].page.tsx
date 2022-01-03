import { NextPage } from "next";
import { gql } from "@apollo/client";
import {
  useRequestIdPageQuery,
  useRequestIdPageResponseLazyQuery,
  useRequestIdPageSideQuery,
} from "../../../../graphql-types.gen";
import { useRouter } from "next/router";
import Head from "next/head";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { useEffect } from "react";

gql`
  query RequestIdPage($requestId: String!) {
    testRequest(testRequestId: $requestId) {
      name
      preRequest
      preRequestCallback
      request
      testCallback
      updatedAt
    }
  }

  query RequestIdPageSide($projectId: String!) {
    project(projectId: $projectId) {
      testFiles {
        id
        path
        testRequests {
          id
          name
        }
      }
    }
  }

  query RequestIdPageResponse($requestId: String!) {
    testRequest(testRequestId: $requestId) {
      response
    }
  }
`;

export const RequestIdPage: NextPage = () => {
  const router = useRouter();
  const projectId = [router.query.projectId].flat()[0] ?? "";
  const requestId = [router.query.requestId].flat()[0] ?? "";
  const { data } = useRequestIdPageQuery({ variables: { requestId } });
  const { data: sideData } = useRequestIdPageSideQuery({
    variables: { projectId },
  });
  const [fetchResponse, { data: responseData }] =
    useRequestIdPageResponseLazyQuery({ variables: { requestId } });
  useEffect(() => {
    fetchResponse();
  }, []);

  return (
    <>
      {data && (
        <Head>
          <title>{data.testRequest.name} | Astronautica</title>
        </Head>
      )}
      <Layout>
        <Layout.Sider style={{ backgroundColor: "white" }} width={400}>
          <Menu
            mode="inline"
            defaultOpenKeys={sideData?.project.testFiles.map((tf) => tf.path)}
          >
            {sideData?.project.testFiles.map((tf) => (
              <Menu.SubMenu key={tf.path} title={tf.path}>
                {tf.testRequests.map((tr) => (
                  <Menu.Item key={tr.id}>
                    <Link href={`/project/${projectId}/request/${tr.id}`}>
                      {tr.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu>
        </Layout.Sider>
        <Layout style={{ overflow: "scroll" }}>
          <Layout.Content style={{ padding: "1rem 1rem 0" }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <pre>
              {JSON.stringify(
                JSON.parse(responseData?.testRequest.response ?? "{}"),
                null,
                2
              )}
            </pre>
            <div style={{ height: "50vh" }} />
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default RequestIdPage;

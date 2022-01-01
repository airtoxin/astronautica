import { NextPage } from "next";
import { gql } from "@apollo/client";
import { useProjectIdPageQuery } from "../../graphql-types.gen";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { Breadcrumb, BreadcrumbFragment } from "../../state";
import { useEffect } from "react";
import Head from "next/head";
import { Collapse, List } from "antd";

gql`
  query ProjectIdPage($projectId: String!) {
    viewer {
      organizations {
        id
        name
      }
    }
    project(projectId: $projectId) {
      id
      name
      organization {
        id
        name
        projects {
          id
          name
        }
      }
      apiKeys {
        description
        createdAt
        updatedAt
        lastUsedAt
        expiresAt
      }
      testFiles {
        path
        testRequests {
          id
          name
        }
      }
    }
  }
`;

export const ProjectIdPage: NextPage = () => {
  const router = useRouter();
  const projectId = [router.query.projectId].flat()[0] ?? "";
  const { data } = useProjectIdPageQuery({ variables: { projectId } });

  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb(
      [
        { name: "Home", path: "/" },
        { name: "Organization", path: "/organization" },
      ].concat(
        data != null
          ? ([
              {
                name: data.project.organization.name,
                path: `/organization/${data.project.organization.id}`,
                options: data.viewer.organizations.map((o) => ({
                  name: o.name,
                  path: `/organization/${o.id}`,
                })),
              },
              {
                name: data.project.name,
                path: `/project/${data.project.id}`,
                options: data.project.organization.projects.map((p) => ({
                  name: p.name,
                  path: `/project/${p.id}`,
                })),
              },
            ] as BreadcrumbFragment[])
          : []
      )
    );
  }, [data]);

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>{data.project.name} | Astronautica</title>
      </Head>
      <pre>{JSON.stringify(data.project, null, 2)}</pre>
      <Collapse>
        {data.project.testFiles.map((testFile) => (
          <Collapse.Panel key={testFile.path} header={testFile.path}>
            <List
              itemLayout="horizontal"
              dataSource={testFile.testRequests}
              renderItem={(testFile) => (
                <List.Item>
                  <List.Item.Meta title={<span>{testFile.name}</span>} />
                </List.Item>
              )}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

export default ProjectIdPage;

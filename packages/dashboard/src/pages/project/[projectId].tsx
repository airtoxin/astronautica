import { NextPage } from "next";
import { gql } from "@apollo/client";
import { useProjectIdPageQuery } from "../../graphql-types.gen";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { Breadcrumb, BreadcrumbFragment } from "../../state";
import { useEffect } from "react";
import Head from "next/head";
import { Collapse, Layout, List, Menu } from "antd";
import Link from "next/link";

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
      <Layout>
        <Layout.Sider style={{ backgroundColor: "white" }} width={400}>
          <Menu
            mode="inline"
            defaultOpenKeys={data.project.testFiles.map((tf) => tf.path)}
          >
            {data.project.testFiles.map((tf) => (
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
            <div style={{ height: "50vh" }} />
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default ProjectIdPage;

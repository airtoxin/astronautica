import { useCallback, useEffect } from "react";
import { Button, Collapse, Space, Table } from "antd";
import { gql } from "@apollo/client";
import {
  OrganizationIdPageQuery,
  useOrganizationIdPageProjectCreationFormMutation,
  useOrganizationIdPageQuery,
} from "../../graphql-types.gen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { Breadcrumb, BreadcrumbFragment } from "../../state";
import { NextPage } from "next";
import Head from "next/head";
import {
  FormState,
  ProjectCreationForm,
} from "../../components/ProjectCreationForm";

gql`
  query OrganizationIdPage($organizationId: String!) {
    viewer {
      organizations {
        id
        name
      }
    }
    organization(organizationId: $organizationId) {
      name
    }
    projects(organizationId: $organizationId) {
      id
      name
      createdAt
      updatedAt
    }
  }

  mutation OrganizationIdPageProjectCreationForm(
    $organizationId: String!
    $projectName: String!
    $apiKeyDescription: String
    $apiKeyExpiration: String
  ) {
    createProject(
      organizationId: $organizationId
      projectName: $projectName
      apiKeyDescription: $apiKeyDescription
      apiKeyExpiration: $apiKeyExpiration
    ) {
      id
    }
  }
`;

type Project = OrganizationIdPageQuery["projects"][number];

export const OrganizationIdPage: NextPage = () => {
  const router = useRouter();
  const organizationId = [router.query.organizationId].flat()[0] ?? "";
  const { data, refetch } = useOrganizationIdPageQuery({
    variables: { organizationId },
  });
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb(
      [
        { name: "Home", path: "/" },
        { name: "Organization", path: "/organization" },
      ].concat(
        data != null
          ? [
              {
                name: data.organization.name,
                path: `/organization/${organizationId}`,
                options: data.viewer.organizations.map((o) => ({
                  name: o.name,
                  path: `/organization/${o.id}`,
                })),
              } as BreadcrumbFragment,
            ]
          : []
      )
    );
  }, [data]);
  const [createProject] = useOrganizationIdPageProjectCreationFormMutation();
  const handleSubmit = useCallback(
    (values: FormState) => {
      createProject({
        variables: {
          organizationId,
          projectName: values.name,
          apiKeyDescription: values.apiKeyDescription,
          apiKeyExpiration: values.expiration?.toISOString(),
        },
      }).then(() => refetch({ organizationId }));
    },
    [organizationId]
  );

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>{data.organization.name} | Astronautica</title>
      </Head>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Collapse ghost style={{ backgroundColor: "white" }}>
          <Collapse.Panel key="new" header="Create project">
            <div style={{ maxWidth: "30rem" }}>
              <ProjectCreationForm onSubmit={handleSubmit} />
            </div>
          </Collapse.Panel>
        </Collapse>
        <Table<Project>
          dataSource={data.projects}
          pagination={false}
          rowKey="id"
        >
          <Table.Column<Project>
            title="Project"
            dataIndex="name"
            key="name"
            render={(name, row) => (
              <Link
                href={`/organization/${organizationId}/project/${row.id}`}
                passHref
              >
                <a>{name}</a>
              </Link>
            )}
          />
          <Table.Column<Project>
            title="Created"
            dataIndex="createdAt"
            key="createdAt"
          />
          <Table.Column<Project>
            title="Updated"
            dataIndex="updatedAt"
            key="updatedAt"
          />
        </Table>
      </Space>
    </>
  );
};

export default OrganizationIdPage;

import { useEffect } from "react";
import { Table } from "antd";
import { gql } from "@apollo/client";
import {
  OrganizationIdPageQuery,
  useOrganizationIdPageQuery,
} from "../../graphql-types.gen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { Breadcrumb, BreadcrumbFragment } from "../../state";
import { NextPage } from "next";
import Head from "next/head";

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
`;

type Project = OrganizationIdPageQuery["projects"][number];

export const OrganizationIdPage: NextPage = () => {
  const router = useRouter();
  const organizationId = [router.query.organizationId].flat()[0] ?? "";
  const { data } = useOrganizationIdPageQuery({
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

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>{data.organization.name} | Astronautica</title>
      </Head>
      <Table<Project> dataSource={data.projects} pagination={false} rowKey="id">
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
    </>
  );
};

export default OrganizationIdPage;

import { VoidFunctionComponent } from "react";
import { Table } from "antd";
import { gql } from "@apollo/client";
import {
  OrganizationIdPageQuery,
  useOrganizationIdPageQuery,
} from "../../graphql-types.gen";
import Link from "next/link";
import { useRouter } from "next/router";

gql`
  query OrganizationIdPage($organizationId: String!) {
    projects(organizationId: $organizationId) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

type Project = OrganizationIdPageQuery["projects"][number];

export const OrganizationIdPage: VoidFunctionComponent = () => {
  const router = useRouter();
  const organizationId = [router.query.organizationId].flat()[0] ?? "";
  const { data } = useOrganizationIdPageQuery({
    variables: { organizationId },
  });

  if (data == null) return null;
  return (
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
  );
};

export default OrganizationIdPage;

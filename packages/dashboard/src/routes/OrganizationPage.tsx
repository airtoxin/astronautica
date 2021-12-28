import { useEffect, VoidFunctionComponent } from "react";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { Link, useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { Table } from "antd";

type Project = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const OrganizationPage: VoidFunctionComponent = () => {
  const { id } = useParams();

  const { data } = trpc.useQuery(["organization.get", { organizationId: id! }]);
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    if (data) {
      setBreadcrumb([
        { path: "/", name: "Top" },
        { path: "/organization", name: "Organization" },
        { path: `/organization/${data.id}`, name: data.name },
      ]);
    }
  }, [data]);

  if (data == null) return null;
  return (
    <Table<Project> dataSource={data.projects} pagination={false} rowKey="id">
      <Table.Column<Project>
        title="Project"
        dataIndex="name"
        key="name"
        render={(name, row) => (
          <Link to={`/organization/${id}/project/${row.id}`}>{name}</Link>
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

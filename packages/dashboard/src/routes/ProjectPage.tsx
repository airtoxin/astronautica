import { useEffect, VoidFunctionComponent } from "react";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { Link, useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { Button, Col, Row, Space, Table } from "antd";

export const ProjectPage: VoidFunctionComponent = () => {
  const { organizationId, projectId } = useParams();

  const { data } = trpc.useQuery(["project.get", { projectId: projectId! }]);

  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { path: "/", name: "Top" },
      { path: "/project", name: "Project" },
    ]);
  }, []);

  if (data == null) return null;
  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Row justify="end">
        <Col>
          <Link
            to={`/organization/${organizationId}/project/${projectId}/new-api-key`}
          >
            <Button>Generate new key</Button>
          </Link>
        </Col>
      </Row>
      <Table dataSource={data.apiKeys} rowKey="id">
        <Table.Column title="Status" dataIndex="status" key="status" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column title="Expires" dataIndex="expiresAt" key="expiresAt" />
        <Table.Column title="Created" dataIndex="createdAt" key="createdAt" />
        <Table.Column
          title="LastUsed"
          dataIndex="lastUsedAt"
          key="lastUsedAt"
        />
      </Table>
    </Space>
  );
};

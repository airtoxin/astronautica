import { useEffect, VoidFunctionComponent } from "react";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { Table, Tag, Space, Button } from "antd";
import Column from "antd/lib/table/Column";

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

  return (
    <div className="w-full">
      <Button type="primary">ボタン</Button>
      <Table dataSource={[]}>
        <Column title="Status" dataIndex="status" key="status" />
        <Column title="API Key" dataIndex="api-key" key="api-key" />
        <Column title="Last used" dataIndex="last-used" key="last-used" />
        <Column title="Created by" dataIndex="created-by" key="created-by" />
      </Table>
    </div>
  );
};

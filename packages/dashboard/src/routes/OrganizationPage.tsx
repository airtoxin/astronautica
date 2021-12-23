import { useEffect, VoidFunctionComponent } from "react";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { useParams } from "react-router-dom";
import { trpc } from "../trpc";

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
      <table>
        <tr>
          <th>Status</th>
          <th>API Key</th>
          <th>Last used</th>
          <th>Created by</th>
        </tr>
        <tr>
          <td>Active</td>
          <td>aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa</td>
          <td>Last 2 min.</td>
          <td>えあんぬ</td>
        </tr>
      </table>
    </div>
  );
};

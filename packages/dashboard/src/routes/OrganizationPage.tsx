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

  return <div className="w-full">yay</div>;
};

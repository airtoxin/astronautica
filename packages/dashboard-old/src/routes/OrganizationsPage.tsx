import { useEffect, VoidFunctionComponent } from "react";
import { trpc } from "../trpc";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { OrganizationsList } from "../components/OrganizationsList";

export const OrganizationsPage: VoidFunctionComponent = () => {
  const { data } = trpc.useQuery(["organization.list"]);

  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { path: "/", name: "Top" },
      { path: "/organization", name: "Organization" },
    ]);
  }, []);

  return (
    <div className="w-full">
      {data && <OrganizationsList organizations={data.organizations} />}
    </div>
  );
};

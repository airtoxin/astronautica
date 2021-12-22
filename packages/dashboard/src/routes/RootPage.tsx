import { useEffect, VoidFunctionComponent } from "react";
import { trpc } from "../trpc";
import { OrganizationCard } from "../components/OrganizationCard";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";

export const RootPage: VoidFunctionComponent = () => {
  const { data } = trpc.useQuery(["organization.list"]);

  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([{ path: "/", name: "Top" }]);
  }, []);

  return (
    <div className="w-full">
      {data &&
        data.organizations.map((organization) => (
          <div key={organization.id} className="first-of-type:mt-0 mt-4">
            <OrganizationCard
              organization={organization}
              accounts={organization.accounts}
            />
          </div>
        ))}
    </div>
  );
};

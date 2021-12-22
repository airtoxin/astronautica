import { VoidFunctionComponent } from "react";
import { trpc } from "../trpc";
import { OrganizationCard } from "../components/OrganizationCard";

export const RootPage: VoidFunctionComponent = () => {
  const { data } = trpc.useQuery(["organization.list"]);
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

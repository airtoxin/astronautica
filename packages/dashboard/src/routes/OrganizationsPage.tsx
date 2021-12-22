import { VoidFunctionComponent } from "react";
import { trpc } from "../trpc";

export const OrganizationsPage: VoidFunctionComponent = () => {
  const { data } = trpc.useQuery(["organization.list"]);
  return (
    <div className="w-full">
      <h1>Organizations</h1>
      {data &&
        data.organizations.map((organization) => (
          <div className="border w-60 h-60" key={organization.id}>
            <div>{organization.name}</div>
            <div className="flex">
              {organization.accounts.map((account) => (
                <div key={account.id}>{account.name}</div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

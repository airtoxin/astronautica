import { VoidFunctionComponent } from "react";
import { DefaultAccountIcon } from "../ui-libs/AccountIcon";

type Organization = { id: string; name: string };
type Account = { id: string; name: string };

export const OrganizationCard: VoidFunctionComponent<{
  organization: Organization;
  accounts: Account[];
}> = ({ organization, accounts }) => {
  return (
    <div
      className="md:flex border w-full min-h-60 md:min-h-40 bg-white drop-shadow hover:drop-shadow-lg active:drop-shadow transition ease-out "
      key={organization.id}
    >
      <div className="w-40 h-40 p-2">
        <img className="object-cover" src="/public/stack.svg" alt="icon" />
      </div>
      <div className="flex flex-col p-2 flex-grow">
        <h2 className="text-2xl">{organization.name}</h2>
        <div className="flex mt-auto">
          {accounts.map((account) => (
            <div key={account.id} className="first:ml-0 ml-2">
              <DefaultAccountIcon accountName={account.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

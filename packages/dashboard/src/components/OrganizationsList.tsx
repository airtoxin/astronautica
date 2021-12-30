import { VoidFunctionComponent } from "react";
import { List, Avatar } from "antd";
import styles from "./OrganizationsList.module.css";
import Link from "next/link";
import { gql } from "@apollo/client";
import { OrganizationsListFragment } from "../graphql-types.gen";

gql`
  fragment OrganizationsList on Organization {
    id
    name
    accounts {
      id
      name
    }
  }
`;

type Props = {
  organizations: OrganizationsListFragment[];
};
export const OrganizationsList: VoidFunctionComponent<Props> = ({
  organizations,
}) => {
  return (
    <List<OrganizationsListFragment>
      itemLayout="vertical"
      size="large"
      dataSource={organizations}
      renderItem={(organization) => (
        <List.Item
          className={styles.listItem}
          actions={[
            <Avatar.Group>
              {organization.accounts.map((account) => (
                <Avatar
                  key={account.id}
                  style={{ backgroundColor: getColor(account.name) }}
                >
                  {account.name.slice(0, 1)}
                </Avatar>
              ))}
            </Avatar.Group>,
          ]}
          extra={<img height={150} alt="logo" src="/assets/stack.svg" />}
        >
          <Link href={`/organization/${organization.id}`} passHref>
            <a>
              <List.Item.Meta title={organization.name} />
            </a>
          </Link>
        </List.Item>
      )}
    />
  );
};

const getColor = (accountName: string) => {
  const r = ("00" + accountName.charCodeAt(0).toString(16)).slice(-2);
  const g = ("00" + accountName.charCodeAt(1).toString(16)).slice(-2);
  const b = ("00" + accountName.charCodeAt(2).toString(16)).slice(-2);
  return `#${r}${g}${b}`;
};

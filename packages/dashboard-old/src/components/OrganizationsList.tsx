import { VoidFunctionComponent } from "react";
import { List, Avatar } from "antd";
import { Link } from "react-router-dom";
import styles from "./OrganizationsList.module.css";

type Organization = {
  id: string;
  name: string;
  accounts: { id: string; name: string }[];
};
type Props = {
  organizations: Organization[];
};
export const OrganizationsList: VoidFunctionComponent<Props> = ({
  organizations,
}) => {
  return (
    <List<Organization>
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
          extra={<img height={150} alt="logo" src="/public/stack.svg" />}
        >
          <Link key={organization.id} to={`/organization/${organization.id}`}>
            <List.Item.Meta title={organization.name} />
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

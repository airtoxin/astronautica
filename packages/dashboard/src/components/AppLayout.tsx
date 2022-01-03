import { FunctionComponent } from "react";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useAppLayoutQuery } from "../graphql-types.gen";
import { DownOutlined } from "@ant-design/icons";

gql`
  query AppLayout {
    viewer {
      organizations {
        id
        name
        projects {
          id
          name
        }
      }
    }
  }
`;

export const AppLayout: FunctionComponent = ({ children }) => {
  const { data } = useAppLayoutQuery();
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Layout.Header
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "0",
          borderBottom: "solid 1px lightgray",
        }}
      >
        <Link href="/" passHref>
          <a>
            <div style={{ display: "flex", width: 200, height: "100%" }}>
              <img
                src="/assets/logo_full.svg"
                alt="logo"
                style={{ width: "100%", padding: "0 0.5rem" }}
              />
            </div>
          </a>
        </Link>
        <Dropdown
          overlay={
            <Menu>
              {data &&
                data.viewer.organizations.map((o) => (
                  <Menu.Item key={o.id}>
                    <Link href={`/organization/${o.id}`} passHref>
                      <a>{o.name}</a>
                    </Link>
                  </Menu.Item>
                ))}
            </Menu>
          }
        >
          <div style={{ marginLeft: "2rem" }}>
            Organization <DownOutlined />
          </div>
        </Dropdown>
        <Dropdown
          overlay={
            <Menu mode="horizontal">
              {data &&
                data.viewer.organizations.map((o) => (
                  <Menu.ItemGroup key={o.id} title={o.name}>
                    {o.projects.map((p) => (
                      <Menu.Item key={p.id}>
                        <Link href={`/project/${p.id}`} passHref>
                          <a>{p.name}</a>
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.ItemGroup>
                ))}
            </Menu>
          }
        >
          <div style={{ marginLeft: "2rem" }}>
            Project <DownOutlined />
          </div>
        </Dropdown>

        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>Settings</Menu.Item>
              <Menu.Item>Logout</Menu.Item>
            </Menu>
          }
        >
          <div style={{ marginLeft: "auto", marginRight: "1rem" }}>
            <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
              U
            </Avatar>
          </div>
        </Dropdown>
      </Layout.Header>
      {children}
    </Layout>
  );
};

import { FunctionComponent } from "react";
import { Menu, Layout, Divider } from "antd";
import { GlobalBreadcrumb } from "./GlobalBreadcrumb";
import Link from "next/link";

export const AppLayout: FunctionComponent = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        collapsible
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        <div style={{ height: "4rem", backgroundColor: "gray" }}>
          Astronautica
        </div>
        <Menu mode="inline" theme="dark">
          <Menu.Item key="organization">
            <Link href="/organization">Organization</Link>
          </Menu.Item>
          <Menu.Item key="project">
            <Link href="/project">Project</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Content style={{ padding: "1rem 1rem 0" }}>
          <GlobalBreadcrumb />
          <Divider />
          {children}
        </Layout.Content>
        <div style={{ height: "50vh" }} />
      </Layout>
    </Layout>
  );
};

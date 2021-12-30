import { FunctionComponent } from "react";
import { Menu, Layout, Divider } from "antd";
import { GlobalBreadcrumb } from "./GlobalBreadcrumb";

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
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout style={{ backgroundColor: "white" }}>
        <Layout.Content style={{ padding: "1rem 1rem 0" }}>
          <GlobalBreadcrumb />
          <Divider />
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

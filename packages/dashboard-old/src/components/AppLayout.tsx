import { VoidFunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Layout } from "antd";
import { GlobalBreadcrumb } from "./GlobalBreadcrumb";

export const AppLayout: VoidFunctionComponent = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider collapsible>
        <div style={{ height: "4rem", backgroundColor: "gray" }}>
          Astronautica
        </div>
        <Menu mode="inline" theme="dark">
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout style={{ backgroundColor: "white" }}>
        <Layout.Header>
          <GlobalBreadcrumb />
        </Layout.Header>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

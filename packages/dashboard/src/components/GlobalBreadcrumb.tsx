import { VoidFunctionComponent } from "react";
import { useRecoilValue } from "recoil";
import { Breadcrumb as BreadcrumbState } from "../state";
import { Breadcrumb, Menu } from "antd";
import Link from "next/link";

export const GlobalBreadcrumb: VoidFunctionComponent = () => {
  const breadcrumb = useRecoilValue(BreadcrumbState);
  return (
    <Breadcrumb style={{ color: "white" }}>
      {breadcrumb.map((b) => (
        <Breadcrumb.Item
          key={`${b.name}-${b.path}`}
          overlay={
            b.options ? (
              <Menu>
                {b.options.map((o) => (
                  <Menu.Item key={`${o.name}-${o.path}`}>
                    <Link href={o.path}>
                      <a>{o.name}</a>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
            ) : undefined
          }
        >
          <Link href={b.path} passHref>
            <a>{b.name}</a>
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

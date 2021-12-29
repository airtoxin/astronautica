import { Fragment, VoidFunctionComponent } from "react";
import { useRecoilValue } from "recoil";
import { Breadcrumb } from "../state";
import { Row } from "antd";
import Link from "next/link";

export const GlobalBreadcrumb: VoidFunctionComponent = () => {
  const breadcrumb = useRecoilValue(Breadcrumb);
  return (
    <Row>
      {breadcrumb.flatMap(({ name, path }, i) => (
        <Fragment key={`${name}-${path}`}>
          {i !== 0 && (
            <div
              style={{
                margin: "0 0.5rem",
                userSelect: "none",
                color: "white",
              }}
              className="first:ml-0 ml-2 select-none"
            >
              /
            </div>
          )}
          <div className="first:ml-0 ml-2 underline underline-offset-4 text-gray-500">
            <Link href={path} passHref>
              <a>{name}</a>
            </Link>
          </div>
        </Fragment>
      ))}
    </Row>
  );
};

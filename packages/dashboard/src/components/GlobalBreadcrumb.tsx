import { VoidFunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Breadcrumb } from "../state";

export const GlobalBreadcrumb: VoidFunctionComponent = () => {
  const breadcrumb = useRecoilValue(Breadcrumb);
  return (
    <div className="flex text-bold">
      {breadcrumb.flatMap(({ name, path }, i) => (
        <>
          {i !== 0 && <div className="first:ml-0 ml-2 select-none">/</div>}
          <div className="first:ml-0 ml-2 underline underline-offset-4 text-gray-500">
            <Link to={path}>{name}</Link>
          </div>
        </>
      ))}
    </div>
  );
};

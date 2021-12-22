import { VoidFunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";

export const GlobalBreadcrumb: VoidFunctionComponent = () => {
  const location = useLocation();
  const fragments = location.pathname.split("/");
  return (
    <div className="flex text-bold">
      <div className="first:ml-0 ml-2">
        <Link to="/">Top</Link>
      </div>
      {fragments.flatMap((fragment, i, all) => {
        if (fragment === "") return null;
        return (
          <>
            <div className="first:ml-0 ml-2 select-none">/</div>
            <div className="first:ml-0 ml-2">
              <Link to={all.slice(0, i + 1).join("/")}>{fragment}</Link>
            </div>
          </>
        );
      })}
    </div>
  );
};

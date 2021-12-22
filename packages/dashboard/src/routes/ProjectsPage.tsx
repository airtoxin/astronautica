import { useEffect, VoidFunctionComponent } from "react";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";

export const ProjectsPage: VoidFunctionComponent = () => {
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { path: "/", name: "Top" },
      { path: "/project", name: "Project" },
    ]);
  }, []);

  return null;
};

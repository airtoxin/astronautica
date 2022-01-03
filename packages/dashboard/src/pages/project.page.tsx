import { NextPage } from "next";
import Head from "next/head";
import { Typography } from "antd";
import { gql } from "@apollo/client";
import { useProjectPageQuery } from "../graphql-types.gen";
import { ProjectsList } from "../components/ProjectsList";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { useEffect } from "react";

gql`
  query ProjectPage {
    viewer {
      organizations {
        id
        name
      }
    }
    projects {
      ...ProjectsList
    }
  }
`;

export const ProjectPage: NextPage = () => {
  const { data } = useProjectPageQuery();
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { name: "Home", path: "/" },
      { name: "Project", path: "/project" },
    ]);
  }, []);

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>Project | Astronautica</title>
      </Head>
      <div>
        <Typography.Title>Projects</Typography.Title>
        <ProjectsList projects={data.projects} />
      </div>
    </>
  );
};

export default ProjectPage;

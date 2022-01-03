import type { NextPage } from "next";
import Head from "next/head";
import { OrganizationsList } from "../components/OrganizationsList";
import { gql } from "@apollo/client";
import { useHomePageQuery } from "../graphql-types.gen";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { useEffect } from "react";

gql`
  query HomePage {
    organizations {
      ...OrganizationsList
    }
  }
`;

const HomePage: NextPage = () => {
  const { data } = useHomePageQuery();
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([{ name: "Home", path: "/" }]);
  }, []);

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>Astronautica</title>
      </Head>
      <OrganizationsList organizations={data.organizations} />
    </>
  );
};

export default HomePage;

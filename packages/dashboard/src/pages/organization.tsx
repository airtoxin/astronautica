import type { NextPage } from "next";
import Head from "next/head";
import { OrganizationsList } from "../components/OrganizationsList";
import { gql } from "@apollo/client";
import { useOrganizationPageQuery } from "../graphql-types.gen";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";
import { useEffect } from "react";

gql`
  query OrganizationPage {
    organizations {
      ...OrganizationsList
    }
  }
`;

const OrganizationPage: NextPage = () => {
  const { data } = useOrganizationPageQuery();
  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { name: "Home", path: "/" },
      { name: "Organization", path: "/organization" },
    ]);
  }, []);

  if (data == null) return null;
  return (
    <>
      <Head>
        <title>Organization | Astronautica</title>
      </Head>
      <OrganizationsList organizations={data.organizations} />
    </>
  );
};

export default OrganizationPage;

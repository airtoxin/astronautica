import type { NextPage } from "next";
import Head from "next/head";
import { OrganizationsList } from "../components/OrganizationsList";
import { gql } from "@apollo/client";
import { useHomePageQuery } from "../graphql-types.gen";

gql`
  query HomePage {
    organizations {
      ...OrganizationsList
    }
  }
`;

const HomePage: NextPage = () => {
  const { data } = useHomePageQuery();

  if (data == null) return null;
  return (
    <div>
      <Head>
        <title>Astronautica</title>
        <meta name="description" content="Astronautica dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationsList organizations={data.organizations} />
    </div>
  );
};

export default HomePage;

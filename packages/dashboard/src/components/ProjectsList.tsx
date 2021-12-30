import { VoidFunctionComponent } from "react";
import { gql } from "@apollo/client";
import { ProjectsListFragment } from "../graphql-types.gen";
import { List } from "antd";
import styles from "./OrganizationsList.module.css";
import Link from "next/link";

gql`
  fragment ProjectsList on Project {
    id
    name
    organization {
      name
    }
  }
`;

type Props = {
  projects: ProjectsListFragment[];
};

export const ProjectsList: VoidFunctionComponent<Props> = ({ projects }) => {
  return (
    <List<ProjectsListFragment>
      itemLayout="vertical"
      size="large"
      dataSource={projects}
      renderItem={(project) => (
        <List.Item className={styles.listItem}>
          <Link href={`/organization/${project.id}`} passHref>
            <a>
              <List.Item.Meta title={project.name} />
            </a>
          </Link>
        </List.Item>
      )}
    />
  );
};

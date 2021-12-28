import { VoidFunctionComponent } from "react";
import { Route, Routes as RRoutes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { RootPage } from "./RootPage";
import { LoginRequiredRoutes } from "./LoginRequiredRoutes";
import { AppLayout } from "../components/AppLayout";
import { ProjectPage } from "./ProjectPage";
import { OrganizationsPage } from "./OrganizationsPage";
import { OrganizationPage } from "./OrganizationPage";
import { AddNewApiKey } from "../components/AddNewApiKey";

export const Routes: VoidFunctionComponent = () => (
  <RRoutes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<LoginRequiredRoutes />}>
      <Route element={<AppLayout />}>
        <Route path="/organization" element={<OrganizationsPage />} />
        <Route path="/organization/:id" element={<OrganizationPage />} />
        <Route
          path="/organization/:organizationId/project/:projectId"
          element={<ProjectPage />}
        />
        <Route
          path="/organization/:organizationId/project/:projectId/new-api-key"
          element={<AddNewApiKey />}
        />
        <Route path="*" element={<RootPage />} />
      </Route>
    </Route>
  </RRoutes>
);

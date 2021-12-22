import { VoidFunctionComponent } from "react";
import { Route, Routes as RRoutes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { RootPage } from "./RootPage";
import { LoginRequiredRoutes } from "./LoginRequiredRoutes";
import { AppLayout } from "../components/AppLayout";
import { ProjectsPage } from "./ProjectsPage";
import { OrganizationsPage } from "./OrganizationsPage";
import { OrganizationPage } from "./OrganizationPage";

export const Routes: VoidFunctionComponent = () => (
  <RRoutes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<LoginRequiredRoutes />}>
      <Route element={<AppLayout />}>
        <Route path="/organization" element={<OrganizationsPage />} />
        <Route path="/organization/:id" element={<OrganizationPage />} />
        <Route path="/project" element={<ProjectsPage />} />
        <Route path="*" element={<RootPage />} />
      </Route>
    </Route>
  </RRoutes>
);

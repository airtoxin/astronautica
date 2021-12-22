import { VoidFunctionComponent } from "react";
import { Route, Routes as RRoutes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { RootPage } from "./RootPage";
import { LoginRequiredRoutes } from "./LoginRequiredRoutes";
import { AppLayout } from "../components/AppLayout";

export const Routes: VoidFunctionComponent = () => (
  <RRoutes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<LoginRequiredRoutes />}>
      <Route element={<AppLayout withoutHeader />}>
        <Route path="/organization" element={<RootPage />} />
        <Route path="/project" element={<RootPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="*" element={<RootPage />} />
      </Route>
    </Route>
  </RRoutes>
);

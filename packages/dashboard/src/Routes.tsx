import { VoidFunctionComponent } from "react";
import { Route, Routes as RRoutes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { RootPage } from "./RootPage";
import { LoginRequiredRoutes } from "./LoginRequiredRoutes";

export const Routes: VoidFunctionComponent = () => (
  <RRoutes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<LoginRequiredRoutes />}>
      <Route path="*" element={<RootPage />} />
    </Route>
  </RRoutes>
);

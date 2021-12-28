import { VoidFunctionComponent } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { trpc } from "../trpc";

export const LoginRequiredRoutes: VoidFunctionComponent = () => {
  const { data, error } = trpc.useQuery(["auth.session"]);
  if (data === false || error) return <Navigate to="/login" />;
  return <Outlet />;
};

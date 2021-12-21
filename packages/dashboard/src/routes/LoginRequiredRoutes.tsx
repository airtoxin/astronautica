import { VoidFunctionComponent } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { trpc } from "../trpc";

export const LoginRequiredRoutes: VoidFunctionComponent = () => {
  const { data, isLoading, error } = trpc.useQuery(["auth.session"]);
  if (data === false) return <Navigate to="/login" />;
  return (
    <div>
      <h1>LoggedIn</h1>
      <Outlet />
    </div>
  );
};

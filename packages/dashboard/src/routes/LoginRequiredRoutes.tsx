import { VoidFunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import { trpc } from "../trpc";

export const LoginRequiredRoutes: VoidFunctionComponent = () => {
  const { data, isLoading, error } = trpc.useQuery(["auth.session"]);
  console.log("@data,isLoading,error", data, isLoading, error);
  return (
    <div>
      <h1>LoggedIn</h1>
      <Outlet />
    </div>
  );
};

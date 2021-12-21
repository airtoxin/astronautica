import { VoidFunctionComponent } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const LoginRequiredRoutes: VoidFunctionComponent = () => {
  const authorized = Math.random() < 0.5;
  if (!authorized) return <Navigate to="/login" />;
  return (
    <div>
      <h1>LoggedIn</h1>
      <Outlet />
    </div>
  );
};

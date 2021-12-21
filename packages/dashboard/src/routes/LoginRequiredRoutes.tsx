import { VoidFunctionComponent } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { trpc } from "../trpc";

export const LoginRequiredRoutes: VoidFunctionComponent = () => {
  const { data, error } = trpc.useQuery(["auth.session"]);
  if (data === false || error) return <Navigate to="/login" />;
  return (
    <div className="flex bg-gray-100 min-h-screen w-screen">
      <aside className="bg-white w-60 h-screen sticky top-0">
        <div className="flex items-center justify-center mt-10">
          <a href="/">Astronautica</a>
        </div>
        <nav className="mt-10">
          <a
            className="flex items-center py-2 px-8 bg-gray-200 text-gray-700 border-r-4 border-gray-700"
            href="#"
          >
            ああああ
          </a>
          <a
            className="flex items-center py-2 px-8 text-gray-600 border-r-4 border-white hover:bg-gray-100 hover:text-gray-700 hover:border-gray-700"
            href="#"
          >
            いいいい
          </a>
        </nav>
      </aside>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};
